import express from 'express';
import db from '../models';

const router = express.Router();
const { User } = db;

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
