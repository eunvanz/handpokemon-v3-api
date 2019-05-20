import express from 'express';

import db from '../models';

const router = express.Router();
const { Code } = db;

router.get('/', async (req, res, next) => {
  try {
    const codes = await Code.findAll();
    res.json(codes);
  } catch (error) {
    next(error);
  }
});

export default router;
