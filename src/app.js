import db from './models';
import mocks from './mocks/index';
import express from './services/express';
import routes from './routes';

const app = express(routes);

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
      Promise.all(
        mocks.codes.map(item => {
          return db.Code.create(item);
        })
      )
        .then(() => {
          return Promise.all(
            mocks.users.map(item => {
              return db.User.create(item);
            })
          );
        })
        .then(() => {
          return Promise.all(
            mocks.mons.map(item => {
              return db.Mon.create(item);
            })
          );
        })
        .then(() => {
          return Promise.all(
            mocks.collections.map(item => {
              return db.Collection.create(item);
            })
          );
        })
        .then(() => {
          return Promise.all(
            mocks.monImages.map(item => {
              return db.MonImage.create(item);
            })
          );
        })
        .catch(err => {
          console.error(err);
        });
    }
  });

export default app;
