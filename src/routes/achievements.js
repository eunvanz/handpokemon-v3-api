import express from 'express';
import db from '../models';

const router = express.Router();
const { Achievement } = db;

router.get('/', async (req, res, next) => {
  try {
    const achievements = await Achievement.findAll();
    res.json(achievements);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
