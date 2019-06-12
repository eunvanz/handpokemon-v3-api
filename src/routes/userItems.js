import express from 'express';
import Sequelize from 'sequelize';
import db from '../models';
import { token } from '../services/passport';
import { ITEM_TYPE } from '../constants/codes';
import { pickMon } from '../libs/hpUtils';

const router = express.Router();
const { Item, User, Collection, Mon, UserItem, MonImage } = db;
const { in: opIn } = Sequelize.Op;

router.get('/', token({ required: true }), async (req, res, next) => {
  try {
    const userItems = await UserItem.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Item,
          as: 'item'
        }
      ]
    });
    res.json(userItems);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  '/use/:itemId',
  token({ required: true }),
  async (req, res, next) => {
    try {
      const { user, params, query } = req;
      const { itemId } = params;
      const { quantity } = query;
      const result = await db.sequelize.transaction(async transaction => {
        const userItems = await UserItem.findAll({
          where: {
            itemId,
            used: 0
          },
          include: [
            {
              model: Item,
              as: 'item'
            }
          ],
          transaction,
          lock: {
            level: transaction.LOCK.UPDATE
          }
        });
        if (userItems.length < quantity)
          return next('아이템 수량이 부족합니다.');

        for (let i = 0; i < quantity; i++) {
          await UserItem.update(
            { used: 1 },
            {
              where: {
                id: userItems[i].id
              },
              fields: ['used'],
              transaction
            }
          );
        }
        const { itemTypeCd, value } = userItems[0].item;
        let updateData, fields;
        if (itemTypeCd === ITEM_TYPE.CREDIT) {
          updateData = {
            [value]: 12
          };
          fields = ['pokemoney', value];
          await User.update(updateData, {
            where: {
              id: thisUser.id
            },
            fields,
            transaction
          });
          return Promise.resolve({ itemTypeCd, value });
        } else if (itemTypeCd === ITEM_TYPE.PICK) {
          const mons = await Mon.findAll({
            where: {
              gradeCd: {
                [opIn]: value.split(',')
              }
            },
            include: [
              {
                model: MonImage,
                as: 'monImages'
              }
            ]
          });
          const pickedMons = await pickMon({
            mons,
            transaction,
            Collection,
            user,
            User,
            useCredit: false,
            repeatCnt: 1,
            Mon,
            MonImage
          });
          return Promise.resolve({ itemTypeCd, value, pickedMons });
        }
      });
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
