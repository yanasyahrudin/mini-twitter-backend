import { Follow, User } from '../models/index.js';

export const followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followeeId = parseInt(req.params.userid);

    // Validation
    if (!followeeId || isNaN(followeeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // Cannot follow
    if (followerId === followeeId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    // followee exists
    const followee = await User.findByPk(followeeId);
    if (!followee) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // already following
    const existingFollow = await Follow.findOne({
      where: {
        follower_id: followerId,
        followee_id: followeeId
      }
    });

    if (existingFollow) {
      return res.status(409).json({
        success: false,
        message: 'You are already following this user'
      });
    }

    // Create follow relationship
    await Follow.create({
      follower_id: followerId,
      followee_id: followeeId
    });

    res.status(201).json({
      success: true,
      message: 'Successfully followed user',
      data: {
        follower_id: followerId,
        followee_id: followeeId
      }
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followeeId = parseInt(req.params.userid);

    // Validation
    if (!followeeId || isNaN(followeeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // follow relationship exists
    const follow = await Follow.findOne({
      where: {
        follower_id: followerId,
        followee_id: followeeId
      }
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: 'You are not following this user'
      });
    }

    // Delete follow relationship
    await follow.destroy();

    res.status(200).json({
      success: true,
      message: 'Successfully unfollowed user'
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const following = await Follow.findAll({
      where: { follower_id: userId },
      include: [
        {
          model: User,
          as: 'Followee',
          attributes: ['id', 'username', 'created_at']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: following
    });
  } catch (error) {
    next(error);
  }
};
