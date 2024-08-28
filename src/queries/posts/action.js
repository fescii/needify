// import models
const { Sequelize, models } = require('../../models');
const Post  = models.Post;

/**
 * @function viewContent
 * @description Query to add a view to a story or reply or a topic, or user profile
 * @param {String} user - The hash of the user viewing the content || can be null
 * @param {String} target - The hash of the content being viewed
 * @returns {Object} - The view object or null, and the error if any
*/
const viewContent = async hash => {
  // view
  await Post.update(
    { views: Sequelize.literal('views + 1') },
    { where: { hash: hash }}
  )
}

module.exports = {
  viewContent
}