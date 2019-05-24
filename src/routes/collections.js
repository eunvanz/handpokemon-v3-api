import express from 'express';
import Sequelize from 'Sequelize';
import { concat, shuffle } from 'lodash';
import db from '../models';
import { GRADE, ROLE } from '../constants/codes';
import { token } from '../services/passport';
import {
  getRandomCollectionsByNumberFromMons,
  getRandomCollectionsByNumberFromMonsWithUserCollections,
  getRefreshedUser
} from '../libs/hpUtils';
import { CREDIT_RULE } from '../constants/rules';

const router = express.Router();
const { Collection, User, Mon, MonImage } = db;
const { in: opIn } = Sequelize.Op;

const includeMon = {
  model: Mon,
  as: 'mon',
  include: [
    {
      model: MonImage,
      as: 'monImages'
    }
  ]
};

const includeUser = {
  model: User,
  as: 'user'
};

router.get('/', async (req, res, next) => {
  try {
    const cols = await Collection.findAll({
      include: [includeMon, includeUser]
    });
    res.json(cols);
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  try {
    const cols = await Collection.findAll({
      where: {
        userId: req.params.userId
      },
      include: [includeMon, includeUser]
    });
    res.json(cols);
  } catch (error) {
    next(error);
  }
});

router.get('/start-pick', async (req, res, next) => {
  try {
    const mons = await Mon.findAll({
      where: {
        gradeCd: GRADE.BASIC
      },
      include: [
        {
          model: MonImage,
          as: 'monImages'
        }
      ]
    });
    const collections = getRandomCollectionsByNumberFromMons({
      repeat: 3,
      mons,
      isExclusive: true
    });
    res.json(collections);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/pick', token({ required: true }), async (req, res, next) => {
  try {
    const { user, query } = req;
    const gradeCds = query.gradeCds.split(',');
    const attrCds = query.attrCds.split(',');
    const repeatCnt = Number(query.repeatCnt);
    const result = await db.sequelize.transaction(async transaction => {
      try {
        let thisUser = await User.findByPk(user.id, {
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });
        // thisUser의 credit을 리프레시
        thisUser = getRefreshedUser(thisUser);
        await User.update(thisUser, {
          where: {
            id: thisUser.id
          },
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });
        if (thisUser.pickCredit < repeatCnt)
          throw new Error('채집 크레딧이 부족합니다.');
        const mons = await Mon.findAll({
          where: {
            gradeCd: {
              [opIn]: gradeCds
            },
            mainAttrCd: {
              [opIn]: attrCds
            }
          },
          include: [
            {
              model: MonImage,
              as: 'monImages'
            }
          ]
        });
        const userCollections = await Collection.findAll({
          where: {
            userId: user.id
          },
          include: [
            {
              model: Mon,
              as: 'mon'
            },
            {
              model: MonImage,
              as: 'monImages'
            }
          ],
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });
        const {
          insert,
          update
        } = getRandomCollectionsByNumberFromMonsWithUserCollections({
          repeatCnt,
          mons,
          userCollections,
          userId: user.id
        });
        insert.forEach(async item => {
          try {
            await Collection.create(item, {
              transaction
            });
          } catch (error) {
            throw new Error(error);
          }
        });
        update.forEach(async item => {
          try {
            await Collection.update(item, {
              where: {
                id: item.id
              },
              transaction,
              lock: {
                level: transaction.LOCK.UPDATE
              }
            });
          } catch (error) {
            throw new Error(error);
          }
        });
        const now = Date.now();
        const diff = now - Number(thisUser.lastPick);
        await User.update(
          Object.assign({}, thisUser, {
            pickCredit: thisUser.pickCredit - repeatCnt,
            lastPick: now - (diff % CREDIT_RULE.PICK.INTERVAL),
            colPoint:
              thisUser.colPoint +
              insert.reduce((accm, item) => accm + item.mon.point, 0)
          }),
          {
            where: { id: thisUser.id },
            transaction,
            lock: {
              level: transaction.LOCK.UPDATE
            }
          }
        );
        return Promise.resolve(shuffle(concat(insert, update)));
      } catch (error) {
        throw new Error(error);
      }
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
