import { Post, User } from '../models/index.js';

export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty'
      });
    }

    if (content.length > 200) {
      return res.status(422).json({
        success: false,
        message: 'Post content cannot exceed 200 characters'
      });
    }

    // Create post
    const post = await Post.create({
      user_id: userId,
      content: content.trim()
    });

    // Fetch post with user details
    const postWithUser = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: postWithUser
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: posts } = await Post.findAndCountAll({
      where: { user_id: userId },
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
