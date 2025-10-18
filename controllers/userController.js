import { User, Follow } from '../models/index.js';
import { Op } from 'sequelize';

export const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.id;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search username (excluding current user)
    const users = await User.findAll({
      where: {
        username: {
          [Op.iLike]: `%${query}%`
        },
        id: {
          [Op.ne]: currentUserId
        }
      },
      attributes: ['id', 'username', 'created_at'],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    // except current user
    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: currentUserId
        }
      },
      attributes: ['id', 'username', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    // Get list of users current user is following
    const following = await Follow.findAll({
      where: { follower_id: currentUserId },
      attributes: ['followee_id']
    });

    const followingIds = following.map(f => f.followee_id);

    // Add isFollowing flag to each user
    const usersWithFollowStatus = users.map(user => ({
      ...user.toJSON(),
      isFollowing: followingIds.includes(user.id)
    }));

    res.status(200).json({
      success: true,
      data: usersWithFollowStatus
    });
  } catch (error) {
    next(error);
  }
};
