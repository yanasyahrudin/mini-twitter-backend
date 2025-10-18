import express from 'express';
import { getFeed } from '../controllers/feedController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getFeed);

export default router;
