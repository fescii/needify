// Import models
const { Sequelize, sequelize} = require('../../models');
const { feedsLoggedIn, feeds } = require('../raw').feed;

/**
 * @function fetchFeeds
 * @description Query to finding trending posts and posts
 * @param {Object} reqData - The request data
 * @returns {Object} - The posts object or null, and the error if any
*/
const fetchFeeds = async reqData => {
  const { user, limit, page } = reqData;

  // calculate the offset and limit
  const offset = (page - 1) * limit;

  return user ? await fetchFeedsWhenLoggedIn(user, offset, limit) : await fetchFeedsWhenLoggedOut(offset, limit);
}

/**
 * @function fetchFeedsWhenLoggedIn
 * @description Query to finding trending posts an posts when logged in: using views and likes in the last 7 days
 * @param {String} user - The user hash
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The posts object or null, and the error if any
*/
const fetchFeedsWhenLoggedIn = async (user, offset, limit) => {
  const posts = await sequelize.query(feedsLoggedIn, {
    replacements: {
      user, 
      offset, 
      limit 
    },
    type: Sequelize.QueryTypes.SELECT
  });
  
  // return the posts: map the posts' dataValues
  return posts.map(post => {
    post.you = user === post.author;
    return post;
  });
}

/**
 * @function fetchFeedsWhenLoggedOut
 * @description Query to finding trending posts when logged out: using views in the last 30 days
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The posts object or null, and the error if any
*/
const fetchFeedsWhenLoggedOut = async (offset, limit) => {
  const posts = await sequelize.query(feeds, {
    replacements: { 
      offset: offset,
      limit: limit
    },
    type: Sequelize.QueryTypes.SELECT
  });

  // return the posts: map the posts' dataValues
  return posts.map(post => {
    post.you = false;
    return post;
  });
}

// Export all queries as a single object
module.exports = {
  fetchFeeds
}