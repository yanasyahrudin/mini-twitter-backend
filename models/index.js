import User from './User.js';
import Post from './Post.js';
import Follow from './Follow.js';

// User has many Posts
User.hasMany(Post, {
  foreignKey: 'user_id',
  as: 'posts'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'author'
});

// User follows Users (self-referencing many-to-many)
User.belongsToMany(User, {
  through: Follow,
  as: 'followers',
  foreignKey: 'followee_id',
  otherKey: 'follower_id'
});

User.belongsToMany(User, {
  through: Follow,
  as: 'following',
  foreignKey: 'follower_id',
  otherKey: 'followee_id'
});

export { User, Post, Follow };
