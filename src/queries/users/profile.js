// Import user and sequelize from models
const { sequelize, Sequelize } = require('../../models').models;
const { 
  userPosts
} = require('../raw').profile;


/**
 * @function fetchUserPosts
 * @description A query function to get the posts of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const findUserPosts = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  const posts = await sequelize.query(userPosts, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });

  // map the posts' sections
  return posts.map(post => {
    post.you = user === story.author;
    return post;
  });
};

module.exports = {
  findUserPosts
}