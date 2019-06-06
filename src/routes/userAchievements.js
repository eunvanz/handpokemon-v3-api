import express from 'express';
import db from '../models';
import { token } from '../services/passport';

const router = express.Router();
const { UserAchievement, Achievement } = db;

router.get('/token', token({ required: true }), async (req, res, next) => {
  try {
    const userAchievements = await UserAchievement.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Achievement,
          as: 'achievement'
        }
      ]
    });
    res.json(userAchievements);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
