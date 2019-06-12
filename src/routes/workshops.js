import express from 'express';
import db from '../models';
import { token } from '../services/passport';
import { ROLE } from '../constants/codes';
import { generatePaginationResult } from '../libs/sequelizeUtils';
import { token } from '../services/passport/index';

const router = express.Router();
const { Workshop, Like, Comment } = db;

router.get('/', async (req, res, next) => {
  try {
    const { query } = req;
    const { curPage, perPage } = query;
    const totalElements = await Workshop.count();
    const mons = await Workshop.findAll({
      order: [['id', 'DESC']],
      offset: (Number(curPage) - 1) * Number(perPage),
      limit: Number(perPage),
      include: [
        {
          model: Like,
          as: 'likes'
        },
        {
          model: Comment,
          as: 'comments'
        }
      ]
    });
    res.json(
      generatePaginationResult({
        totalElements,
        curPage,
        perPage,
        content
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post('/', token({ required: true }), async (req, res, next) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.json(workshop);
  } catch (error) {
    next(error);
  }
});

export default router;
