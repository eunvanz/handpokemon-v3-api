import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import db from './models';

import monsRouter from './routes/mons';
import usersRouter from './routes/users';
import collectionsRouter from './routes/collections';

import mocks from './mocks/index';

const app = express();

const isDev = process.env.NODE_ENV === 'development';

db.sequelize
  .query('SET FOREIGN_KEY_CHECKS = 0')
  .then(() => {
    return db.sequelize.sync({ force: isDev });
  })
  .then(() => {
    return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  })
  .then(() => {
    if (isDev) {
      mocks.codes.forEach(item => {
        db.Code.create(item);
      });
      mocks.users.forEach(item => {
        db.User.create(item);
      });
      mocks.mons.forEach(item => {
        db.Mon.create(item);
      });
      mocks.collections.forEach(item => {
        db.Collection.create(item);
      });
      mocks.monImages.forEach(item => {
        db.MonImage.create(item);
      });
    }
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/mons', monsRouter);
app.use('/collections', collectionsRouter);
app.use((err, req, res, next) => {
  res.status(500).send({ error: err });
});

export default app;
