import express from 'express';
import db from '../models';
import { token } from '../services/passport';
import { generatePaginationResult } from '../libs/sequelizeUtils';

const router = express.Router();
const { Comment, User } = db;

router.get('/', async (req, res, next) => {
  try {
    const { query } = req;
    const { curPage, perPage, conditionKey, conditionValue } = query;
    const totalElements = await Comment.count();
    const content = await Comment.findAll({
      where: {
        [conditionKey]: conditionValue
      },
      order: [['id', 'DESC']],
      offset: (Number(curPage) - 1) * Number(perPage),
      limit: Number(perPage),
      include: [
        {
          model: User,
          as: 'user'
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
    console.error(error);
    next(error);
  }
});

router.post('/', token({ required: true }), async (req, res, next) => {
  try {
    const comment = await Comment.create(
      Object.assign({ userId: req.user.id }, req.body)
    );
    comment.setDataValue('user', req.user);
    res.json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/:id', token({ required: true }), async (req, res, next) => {
  try {
    const result = await Comment.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (result[0] === 0) return next('해당하는 댓글이 없습니다.');
    res.json();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id', token({ required: true }), async (req, res, next) => {
  try {
    await Comment.destroy({
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
