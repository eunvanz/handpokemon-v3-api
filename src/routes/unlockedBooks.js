import express from 'express';
import db from '../models';
import { token } from '../services/passport';
import { BOOK_RULE } from '../constants/rules';

const router = express.Router();
const { UnlockedBook, User } = db;

router.post('/', token({ required: true }), async (req, res, next) => {
  try {
    const result = await db.sequelize.transaction(async transaction => {
      try {
        const unlockedBook = await UnlockedBook.findOne({
          where: {
            userId: req.user.id,
            attrCd: req.body.attrCd,
            seq: req.body.seq
          },
          transaction
        });

        if (unlockedBook) return next('이미 헤제된 도감입니다.');

        const user = await User.findByPk(req.user.id, {
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });

        const unlockCost = BOOK_RULE[req.body.seq];
        if (user.pokemoney < unlockCost) return next('포키머니가 부족합니다.');

        const result = await User.update(
          { pokemoney: user.pokemoney - unlockCost },
          {
            where: {
              id: user.id
            },
            transaction,
            fields: ['pokemoney']
          }
        );

        if (result[0] !== 1)
          return next('포키머니 차감 중 오류가 발생했습니다.');

        const newUnlockedBook = await UnlockedBook.create(
          Object.assign({}, req.body, { userId: user.id }),
          {
            transaction
          }
        );

        return Promise.resolve(newUnlockedBook);
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
    const unlockedBooks = await UnlockedBook.findAll({
      where: {
        userId: req.user.id
      }
    });
    res.json(unlockedBooks);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
