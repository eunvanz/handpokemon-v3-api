import express from 'express';
import Sequelize from 'Sequelize';
import db from '../models';
import { GRADE, ROLE } from '../constants/codes';
import { token } from '../services/passport';
import { getRandomCollectionsByNumberFromMons } from '../libs/hpUtils';

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

router.get(
  '/pick',
  token({ required: true, roles: [ROLE.USER, ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const { user, query } = req;
      const gradeCds = query.gradeCds.split(',');
      const repeat = Number(query.repeat);
      if (user.pickCredit < repeat) next('채집 크레딧이 부족합니다.');
      const mons = await Mon.findAll({
        where: {
          gradeCd: {
            [opIn]: gradeCds
          }
        },
        include: [
          {
            model: MonImage,
            as: 'monImages'
          }
        ]
      });
      Sequelize.Transaction(async t => {
        const userCollections = await Collection.findAll({
          where: {
            userId: user.id
          },
          include: [
            {
              model: Mon,
              as: 'mon'
            }
          ],
          transaction: t
        });
        getRandomCollectionsByNumberFromMonsWithUserCollections({
          repeatCnt,
          mons,
          userCollections
        });
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
