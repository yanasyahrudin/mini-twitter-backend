import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid token'
      });
    }

    // Attach user to request
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'username', 'created_at']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Authentication failed'
    });
  }
};
