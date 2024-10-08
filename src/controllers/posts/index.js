// Import all stroy controllers and export them as an object
const {
  createPost, updatePost, deletePost,
  updateLocation, updatePrice, updateEnd,
  publishPost, updateName
} = require('./base');
const { findUserFollowers, findUserFollowing, findAuthorPosts } = require('./author');
const { getPost } = require('./public');


// Export all controllers as a single object
module.exports = {
  createPost, updatePost, deletePost, updateLocation,
  updatePrice, updateEnd, publishPost, updateName,
  findUserFollowers, findUserFollowing, findAuthorPosts, getPost
}