import { Router } from 'express';
import users from './users';
import mons from './mons';
import collections from './collections';
import files from './files';
import monImages from './monImages';
import codes from './codes';
import books from './books';
import unlockedBooks from './unlockedBooks';
import achievements from './achievements';
import userAchievements from './userAchievements';
import items from './items';
import userItems from './userItems';
import workshops from './workshops';
import likes from './likes';
import comments from './comments';

const router = new Router();

router.use('/users', users);
router.use('/mons', mons);
router.use('/collections', collections);
router.use('/files', files);
router.use('/mon-images', monImages);
router.use('/codes', codes);
router.use('/books', books);
router.use('/unlocked-books', unlockedBooks);
router.use('/achievements', achievements);
router.use('/user-achievements', userAchievements);
router.use('/user-items', userItems);
router.use('/items', items);
router.use('/workshops', workshops);
router.use('/likes', likes);
router.use('/comments', comments);

export default router;
