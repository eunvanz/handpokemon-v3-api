import express from 'express';
import db from '../models';
import { token } from '../services/passport';
import { generatePaginationResult } from '../libs/sequelizeUtils';

const router = express.Router();
const { Workshop, Like, Comment } = db;

router.get('/', async (req, res, next) => {
  try {
    const { query } = req;
    const { curPage, perPage } = query;
    const totalElements = await Workshop.count();
    const content = await Workshop.findAll({
      order: [['id', 'DESC']],
      offset: (Number(curPage) - 1) * Number(perPage),
      limit: Number(perPage),
      include: [
        {
          model: Like,
          as: 'likes'
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
