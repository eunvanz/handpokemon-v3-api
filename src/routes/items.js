import express from 'express';
import db from '../models';
import { token } from '../services/passport';

const router = express.Router();
const { Item, User, UserItem } = db;

router.get('/', async (req, res, next) => {
  try {
    const items = await Item.findAll({
      order: [['seq', 'ASC']]
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/buy', token({ required: true }), async (req, res, next) => {
  try {
    const { user, query } = req;
    const { itemId, quantity } = query;
    const result = await db.sequelize.transaction(async transaction => {
      try {
        const item = await Item.findByPk(itemId);
        const thisUser = await User.findByPk(user.id, {
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });
        const { price } = item;
        if (thisUser.pokemoney < price * quantity)
          return next('포키머니가 부족합니다.');
        await User.update(
          { pokemoney: thisUser.pokemoney - price },
          {
            where: {
              id: thisUser.id
            },
            transaction,
            fields: ['pokemoney']
          }
        );
        for (let i = 0; i < quantity; i++) {
          await UserItem.create(
            {
              itemId: item.id,
              userId: thisUser.id
            },
            {
              transaction
            }
          );
        }
        return Promise.resolve();
      } catch (error) {
        console.error(error);
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
