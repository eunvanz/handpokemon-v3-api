import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import db from '../models';
import { encrypt } from '../services/crypto';
import { token } from '../services/passport/index';
import { ROLE, SOCIAL_TYPE } from '../constants/codes';

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

router.get('/token', token({ required: true }), async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: '해당하는 사용자가 없습니다.' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/is-dup-nickname/:nickname', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        nickname: decodeURIComponent(req.params.nickname)
      }
    });
    res.json(user !== null);
  } catch (error) {
    next(error);
  }
});

router.get('/is-dup-email/:email', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: decodeURIComponent(req.params.email),
        socialTypeCd: SOCIAL_TYPE.EMAIL
      }
    });
    res.json(user !== null);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;
    const existEmail = await User.findOne({
      where: {
        email
      }
    });
    if (existEmail)
      return res.status(409).json({ message: '존재하는 이메일입니다.' });
    const existNickname = await User.findOne({
      where: {
        nickname
      }
    });
    if (existNickname)
      return res.status(409).json({ message: '존재하는 닉네임입니다.' });
    const encryptedPassword = await encrypt(password);
    await User.create(
      Object.assign({
        ...req.body,
        password: encryptedPassword
      })
    );
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return next(err || info.message || '로그인 중에 오류가 발생했습니다.');
      }
      req.login(user, { session: false }, err => {
        if (err) return next(err);
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
        return res.json({ user, token });
      });
    })(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/sign-in', async (req, res, next) => {
  try {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return next(err || info.message || '로그인 중에 오류가 발생했습니다.');
      }
      req.login(user, { session: false }, err => {
        if (err) return next(err);
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
        return res.json({ user, token });
      });
    })(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', token({ required: true }), async (req, res, next) => {
  try {
    const result = await User.update(req.body, {
      where: {
        id: req.params.id
      },
      fields: ['profileImage', 'introduce']
    });
    if (result[0] === 1) {
      const newUser = await User.findByPk(req.params.id);
      res.json(newUser);
    } else {
      return res.status(404).json({ message: '해당하는 사용자가 없습니다.' });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  '/all-fields/:id',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const result = await User.update(req.body, {
        where: {
          id: req.params.id
        }
      });
      if (result[0] === 1) {
        const newUser = await User.findByPk(req.params.id);
        res.json(newUser);
      } else {
        return res.status(404).json({ message: '해당하는 사용자가 없습니다.' });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  token({ required: true, roles: [ROLE.ADMIN] }),
  async (req, res, next) => {
    try {
      const result = await User.destroy({
        where: {
          id: req.params.id
        }
      });
      if (result) {
        res.status(200).end();
      } else {
        return res.status(404).json({ messge: '해당하는 사용자가 없습니다.' });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
