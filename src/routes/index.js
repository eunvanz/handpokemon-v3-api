import { Router } from 'express';
import users from './users';
import mons from './mons';
import collections from './collections';
import files from './files';
import monImages from './monImages';
import codes from './codes';

const router = new Router();

router.use('/users', users);
router.use('/mons', mons);
router.use('/collections', collections);
router.use('/files', files);
router.use('/mon-images', monImages);
router.use('/codes', codes);

export default router;
