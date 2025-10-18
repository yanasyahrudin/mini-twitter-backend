import express from 'express';
import { followUser, unfollowUser, getFollowing } from '../controllers/followController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/:userid', authMiddleware, followUser);
router.delete('/:userid', authMiddleware, unfollowUser);
router.get('/list', authMiddleware, getFollowing);

export default router;
