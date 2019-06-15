import express from 'express';
import db from '../models';
import { token } from '../services/passport';

const router = express.Router();
const { Like } = db;

router.post('/', token({ required: true }), async (req, res, next) => {
  try {
    const like = await Like.create(
      Object.assign({ userId: req.user.id }, req.body)
    );
    res.json(like);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id', token({ required: true }), async (req, res, next) => {
  try {
    await Like.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      force: true
    });
    res.json();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { query } = req;
    const { conditionKey, conditionValue } = query;
    const content = await Like.findAll({
      where: {
        [conditionKey]: conditionValue
      }
    });
    res.json({ content });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
