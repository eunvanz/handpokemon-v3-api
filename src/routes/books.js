import express from 'express';
import db from '../models';
import { token } from '../services/passport';

const router = express.Router();
const { Book, Collection, Mon, MonImage, UnlockedBook } = db;

router.post('/', token({ required: true }), async (req, res, next) => {
  try {
    const userBooks = await Book.findAll({
      where: {
        userId: req.user.id
      }
    });

    if (req.body.seq > 2) {
      const unlockedBooks = await UnlockedBook.findOne({
        where: {
          userId: req.user.id,
          attrCd: req.body.attrCd,
          seq: req.body.seq
        }
      });
      if (!unlockedBooks) return next('먼저 도감을 해제해주세요.');
    }

    if (userBooks.map(book => book.colId).indexOf(req.body.colId) > -1)
      return next('이미 등록된 콜렉션입니다.');
    const newBook = await Book.create(req.body);
    res.json(newBook);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/token', token({ required: true }), async (req, res, next) => {
  try {
    const books = await Book.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Collection,
          as: 'col',
          include: [
            {
              model: Mon,
              as: 'mon'
            },
            {
              model: MonImage,
              as: 'monImages'
            }
          ]
        }
      ]
    });
    res.json(books);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  try {
    const books = await Book.findAll({
      where: {
        userId: req.params.userId
      },
      include: [
        {
          model: Collection,
          as: 'col'
        }
      ]
    });
    res.json(books);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', token({ required: true }), async (req, res, next) => {
  try {
    const result = await Book.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (result === 1) res.json(result);
    else next('해당하는 도감이 없습니다.');
  } catch (error) {
    next(error);
  }
});

export default router;
