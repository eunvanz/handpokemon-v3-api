import express from 'express';
import db from '../models';

const router = express.Router();
const { Mon, MonImage } = db;

router.get('/', async (req, res, next) => {
  try {
    const mons = await Mon.findAll();
    res.json(mons);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const mon = await Mon.findByPk(req.params.id, {
      include: [
        // {
        //   model: Mon,
        //   as: 'nextMons'
        // }
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

export default router;
