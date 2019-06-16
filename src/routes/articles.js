import express from 'express';
import db from '../models';
import { generatePaginationResult } from '../libs/sequelizeUtils';
import { token } from '../services/passport/index';

const router = express.Router();
const { Article, User, Comment, Like } = db;

router.get('/:categoryCd', async (req, res, next) => {
  try {
    const { params, query } = req;
    const { perPage, curPage } = query;
    const { categoryCd } = params;
    const totalElements = await Article.count({
      where: {
        categoryCd
      }
    });
    const content = await Article.findAll({
      where: {
        categoryCd
      },
      include: [
        {
          model: User,
          as: 'user'
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user'
            }
          ]
        },
        {
          model: Like,
          as: 'likes'
        }
      ],
      order: [['id', 'DESC']],
      offset: (Number(curPage) - 1) * Number(perPage),
      limit: Number(perPage)
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
    console.error(error);
    next(error);
  }
});

router.post('/', token({ required: true }), async (req, res, next) => {
  try {
    const article = await Article.create(
      Object.assign({}, req.body, { userId: req.user.id })
    );
    res.json(article);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/views/:id', async (req, res, next) => {
  try {
    await Article.increment(['views'], {
      where: {
        id: req.params.id
      }
    });
    res.json();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/:id', token({ required: true }), async (req, res, next) => {
  try {
    await Article.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    res.json();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id', token({ required: true }), async (req, res, next) => {
  try {
    await Article.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    res.json();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
