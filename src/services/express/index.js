import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

require('../passport');

export default routes => {
  const app = express();

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors());
  app.use('/', routes);
  app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message ? err.message.name : err });
  });

  return app;
};
