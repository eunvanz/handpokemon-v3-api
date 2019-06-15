import express from 'express';
import upload from '../services/multer';

const router = express.Router();

router.post('/', async (req, res, next) => {
  // query로 path를 받음 (ex: mon-images)
  try {
    const singleUpload = upload(req.query.path).single('file');
    singleUpload(req, res, err => {
      if (err) {
        next(err);
      } else {
        return res.json({ url: req.file.location, link: req.file.location });
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
