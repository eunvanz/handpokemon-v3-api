import express from 'express';
import db from '../models';
import { token } from '../services/passport';
import { ROLE } from '../constants/codes';

const router = express.Router();
const { Mon, MonImage } = db;

router.get('/', async (req, res, next) => {
  try {
    const mons = await Mon.findAll({
      include: [
        {
          model: MonImage,
          as: 'monImages'
        }
      ],
      order: [['id', 'ASC']]
    });
    res.json(mons);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const mon = await Mon.findByPk(req.params.id, {
      include: [
        {
          model: Mon,
          as: 'nextMons'
        },
        {
          model: MonImage,
          as: 'monImages'
        }
      ]
    });
    res.json(mon);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const newMon = await Mon.create(req.body);
      res.json(newMon);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const result = await Mon.update(req.body, {
        where: {
          id: req.params.id
        }
      });
      if (result[0] === 1) {
        const newMon = await Mon.findByPk(req.params.id);
        res.json(newMon);
      } else {
        next({ error: '해당하는 포켓몬이 없습니다.' });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
