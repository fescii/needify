// import all queries 
const { viewContent } = require('./action');
const { findPostsByAuthor, findFollowersByAuthor, findFollowingByAuthor } = require('./author');
const {
  addPost, checkIfPostExists, findPost, editPost, editEnd,
  editLocation, findPostByHash, editPrice, removePost, updatePostStatus
} = require('./base');
// const { findReplyReplies, findStoryReplies, findStoryLikes, findReplyLikes } = require('./feeds');

// Export all queries as a single object
module.exports = {
  viewContent, findPostsByAuthor, findFollowersByAuthor, findFollowingByAuthor,
  addPost, checkIfPostExists, findPost, editPost, editEnd,
  editLocation, findPostByHash, editPrice, removePost, updatePostStatus
};