// Import user and sequelize from models
const { sequelize, Sequelize } = require('../../models').models;
const { 
  userPosts
} = require('../raw').profile;


/**
 * @function fetchUserStories
 * @description A query function to get the stories of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const findhUserPosts = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  const stories = await sequelize.query(userPosts, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });

  // map the stories' sections
  return stories.map(story => {
    story.you = user === story.author;
    return story;
  });
};

module.exports = {
  findhUserPosts
}