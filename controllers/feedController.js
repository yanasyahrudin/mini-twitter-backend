import { Post, User, Follow } from '../models/index.js';
import sequelize from '../config/database.js';

export const getFeed = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get list current user is following
    const following = await Follow.findAll({
      where: { follower_id: userId },
      attributes: ['followee_id']
    });

    const followingIds = following.map(f => f.followee_id);

    if (followingIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          posts: [],
          pagination: {
            total: 0,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: 0
          }
        }
      });
    }

    // Fetch posts from followed users
    const { count, rows: posts } = await Post.findAndCountAll({
      where: {
        user_id: followingIds
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
