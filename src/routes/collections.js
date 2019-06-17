import express from 'express';
import Sequelize from 'Sequelize';
import { concat, shuffle, random } from 'lodash';
import db from '../models';
import { GRADE } from '../constants/codes';
import { token } from '../services/passport';
import {
  getRandomCollectionsByNumberFromMons,
  getRandomCollectionsByNumberFromMonsWithUserCollections,
  getRefreshedUser,
  levelDownCollection,
  pickMon
} from '../libs/hpUtils';
import { CREDIT_RULE, MIX_RULE, SPECIAL_MIX_RULE } from '../constants/rules';

const router = express.Router();
const { Collection, User, Mon, MonImage } = db;
const { in: opIn } = Sequelize.Op;

const includeMon = {
  model: Mon,
  as: 'mon'
};

const includeMonImages = {
  model: MonImage,
  as: 'monImages'
};

const includeNextMons = {
  model: Mon,
  as: 'nextMons'
};

const includeUser = {
  model: User,
  as: 'user'
};

router.get('/', async (req, res, next) => {
  try {
    const cols = await Collection.findAll({
      include: [includeMon, includeUser, includeMonImages, includeNextMons]
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
      include: [includeMon, includeUser, includeMonImages, includeNextMons]
    });
    res.json(cols);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/token', token({ required: true }), async (req, res, next) => {
  try {
    const cols = await Collection.findAll({
      where: {
        userId: req.user.id
      },
      include: [includeMon, includeUser, includeMonImages, includeNextMons]
    });
    res.json(cols);
  } catch (error) {
    console.error(error);
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
        },
        {
          model: Mon,
          as: 'nextMons'
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
          transaction
        });
        if (thisUser.pickCredit < repeatCnt)
          return next('채집 크레딧이 부족합니다.');

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
            },
            {
              model: Mon,
              as: 'nextMons'
            }
          ],
          transaction,
          lock: {
            level: transaction.LOCK.SHARE
          }
        });
        return pickMon({
          mons,
          transaction,
          Collection,
          user,
          User,
          useCredit: true,
          repeatCnt,
          Mon,
          MonImage
        });
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

router.get('/mix', token({ required: true }), async (req, res, next) => {
  try {
    const { user, query } = req;
    const collectionIds = query.collectionIds.split(',');
    let colPointDiff = 0;
    const result = await db.sequelize.transaction(async transaction => {
      try {
        let thisUser = await User.findByPk(user.id, {
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });

        const collections = await Collection.findAll({
          where: {
            id: {
              [opIn]: collectionIds
            },
            userId: thisUser.id
          },
          include: [
            {
              model: Mon,
              as: 'mon'
            }
          ],
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });

        if (collections.length !== 2) return next('잘못된 요청입니다.');

        collections.forEach(async collection => {
          if (collection.level === 1) {
            await Collection.destroy({
              where: {
                id: collection.id
              },
              force: true,
              transaction
            });
            colPointDiff += collection.mon.point * -1;
          } else {
            await Collection.update(levelDownCollection(collection), {
              where: {
                id: collection.id
              },
              transaction,
              fields: [
                'level',
                'addedHp',
                'addedPower',
                'addedArmor',
                'addedSPower',
                'addedSArmor',
                'addedDex',
                'addedTotal'
              ]
            });
          }
        });

        let mons;
        // 특정 포켓몬끼리의 교배와 그 외 분기
        const specialMixResult = SPECIAL_MIX_RULE(
          collections[0].mon,
          collections[1].mon
        );

        if (specialMixResult) {
          mons = await Mon.findAll({
            where: {
              name: {
                [opIn]: specialMixResult
              }
            },
            include: [
              {
                model: MonImage,
                as: 'monImages'
              },
              {
                model: Mon,
                as: 'nextMons'
              }
            ]
          });
        } else {
          const { gradeCds, chances } = MIX_RULE(
            collections[0].mon,
            collections[1].mon
          );
          const chancePoint = random(0, 100);
          let gradeCdIdx = 0;

          chances.forEach((value, idx) => {
            if (value >= chancePoint) gradeCdIdx = idx;
          });

          mons = await Mon.findAll({
            where: {
              gradeCd: gradeCds[gradeCdIdx]
            },
            include: [
              {
                model: MonImage,
                as: 'monImages'
              },
              {
                model: Mon,
                as: 'nextMons'
              }
            ],
            transaction,
            lock: {
              level: transaction.LOCK.SHARE
            }
          });
        }

        return pickMon({
          mons,
          transaction,
          Collection,
          user,
          User,
          Mon,
          MonImage
        });
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

router.get('/evolute', token({ required: true }), async (req, res, next) => {
  try {
    const { user, query } = req;
    const collectionId = query.collectionId;
    let colPointDiff = 0;
    const result = await db.sequelize.transaction(async transaction => {
      try {
        let thisUser = await User.findByPk(user.id, {
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });

        const collection = await Collection.findByPk(collectionId, {
          include: [
            {
              model: Mon,
              as: 'mon'
            },
            {
              model: Mon,
              as: 'nextMons'
            }
          ],
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });

        const { nextMons } = collection;

        if (
          !collection ||
          collection.userId !== thisUser.id ||
          nextMons.length === 0
        )
          return next('잘못된 요청입니다.');

        if (collection.level === nextMons[0].requiredLv) {
          await Collection.destroy({
            where: {
              id: collection.id
            },
            force: true,
            transaction
          });
          colPointDiff += collection.mon.point * -1;
        } else {
          await Collection.update(
            levelDownCollection(collection, nextMons[0].requiredLv),
            {
              where: {
                id: collection.id
              },
              transaction,
              fields: [
                'level',
                'addedHp',
                'addedPower',
                'addedArmor',
                'addedSPower',
                'addedSArmor',
                'addedDex',
                'addedTotal'
              ]
            }
          );
        }
        const mons = await Mon.findAll({
          where: {
            id: {
              [opIn]: nextMons.map(mon => mon.id)
            }
          },
          include: [
            {
              model: MonImage,
              as: 'monImages'
            },
            {
              model: Mon,
              as: 'nextMons'
            }
          ],
          transaction,
          lock: {
            level: transaction.LOCK.SHARE
          }
        });
        const userCollections = await Collection.findAll({
          where: {
            userId: user.id
          },
          include: [includeMon, includeMonImages, includeNextMons],
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });
        let {
          insert,
          update
        } = getRandomCollectionsByNumberFromMonsWithUserCollections({
          mons,
          userCollections,
          userId: user.id
        });

        // 토중몬이 진화하는 경우 껍질몬 추가
        if (collection.mon.name === '토중몬') {
          const kkupzilMon = await Mon.findAll({
            where: {
              id: 292 // 껍질몬
            },
            include: [
              {
                model: MonImage,
                as: 'monImages'
              },
              {
                model: Mon,
                as: 'nextMons'
              }
            ],
            transaction
          });
          const kkupzilResult = getRandomCollectionsByNumberFromMonsWithUserCollections(
            {
              mons: kkupzilMon,
              userCollections,
              userId: user.id
            }
          );
          if (kkupzilResult.insert)
            insert = insert.concat(kkupzilResult.insert);
          if (kkupzilResult.update)
            update = update.concat(kkupzilResult.update);
        }

        insert.forEach(async (item, idx) => {
          try {
            if (item) {
              const newCollection = await Collection.create(item, {
                transaction
              });
              insert[idx].id = newCollection.id;
            }
          } catch (error) {
            throw new Error(error);
          }
        });

        update.forEach(async item => {
          try {
            if (item)
              await Collection.update(item, {
                where: {
                  id: item.id
                },
                transaction,
                fields: [
                  'level',
                  'addedHp',
                  'addedPower',
                  'addedArmor',
                  'addedSPower',
                  'addedSArmor',
                  'addedDex',
                  'addedTotal'
                ]
              });
          } catch (error) {
            throw new Error(error);
          }
        });
        colPointDiff += insert.reduce((accm, item) => accm + item.mon.point, 0);
        await User.update(
          Object.assign({}, thisUser, {
            colPoint: thisUser.colPoint + colPointDiff
          }),
          {
            where: { id: thisUser.id },
            transaction
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
