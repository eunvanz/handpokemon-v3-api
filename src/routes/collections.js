import express from 'express';
import db from '../models';

const router = express.Router();
const { Collection, User, Mon, MonImage } = db;

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

export default router;
