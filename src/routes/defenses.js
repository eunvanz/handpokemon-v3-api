import express from 'express';
import db from '../models';
import { token } from '../services/passport';
import { LEAGUE_RULE } from '../constants/rules';

const router = express.Router();
const { Defense, Collection, Mon, MonImage, UnlockedBook } = db;

router.post('/', token({ required: true }), async (req, res, next) => {
  try {
    const { user, body } = req;
    const result = await db.sequelize.transaction(async transaction => {
      try {
        const userDefenses = await Defense.findAll({
          where: {
            userId: user.id
          },
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });
        const seq = body.seq;
        const occupiedUserDefense = userDefenses.filter(
          item => item.seq === seq
        )[0];

        let result;
        if (occupiedUserDefense) {
          // 기존 레코드를 새로운 colId로 업데이트
          await Defense.update(body, {
            where: {
              id: occupiedUserDefense.id
            },
            transaction,
            fields: ['colId']
          });
          // 기존 콜렉션 defense 업데이트
          await Collection.update(
            {
              defense: 0
            },
            {
              where: {
                id: occupiedUserDefense.colId
              },
              transaction,
              fields: ['defense']
            }
          );
          result = Object.assign({}, occupiedUserDefense, body);
        } else {
          result = await Defense.create(body, {
            transaction
          });
        }
        // 콜렉션 defense 업데이트
        await Collection.update(
          {
            defense: 1
          },
          {
            where: {
              id: body.colId
            },
            transaction,
            fields: ['defense']
          }
        );

        // 코스트가 리그의 maxCost 넘어설 경우 오류
        const changedDefenses = await Defense.findAll({
          where: {
            userId: user.id
          },
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });
        const maxCost = LEAGUE_RULE[user.leagueCd].maxCost;
        const currentCost = userDefenses.reduce(
          (accm, item) => (accm += item.col.mon.cost),
          0
        );
        if (currentCost) {
          throw new Error('리그의 제한 코스트를 초과하였습니다.');
        }
        return Promise.resolve(result);
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

router.get('/token', token({ required: true }), async (req, res, next) => {
  try {
    const defenses = await Defense.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Collection,
          as: 'col',
          include: [
            {
              model: Mon,
              as: 'mon'
            },
            {
              model: MonImage,
              as: 'monImages'
            }
          ]
        }
      ]
    });
    res.json(defenses);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  try {
    const defenses = await Defense.findAll({
      where: {
        userId: req.params.userId
      },
      include: [
        {
          model: Collection,
          as: 'col'
        }
      ]
    });
    res.json(defenses);
  } catch (error) {
    next(error);
  }
});

export default router;
