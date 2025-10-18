import express from 'express';
import { searchUsers, getAllUsers } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', authMiddleware, searchUsers);
router.get('/all', authMiddleware, getAllUsers);

export default router;
