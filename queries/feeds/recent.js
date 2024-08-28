// Import models
const { Sequelize, sequelize } = require('../../models').models;

// import raw queries
const { followingStories, recentLoggedIn, recentStories } = require('../raw').recent;
/**
 * @function fetchRecent
 * @description Query to finding recent stories
 * @param {String} user - The request data
 * @returns {Object} - The replies object or null, and the error if any
*/
const fetchRecent = async user => {
  try {
    let stories = null;

    // check if the user is logged in
    if (user) {
      stories = await findStoriesOfFollowing(user);

      // check if stories is empty
      if (stories.length <= 0) {
        stories = await findRecentStoriesWhenLoggedIn(user);
      }
    }
    else {
      stories = await findRecentStoriesWhenLoggedOut();
    }

    // create a data object
    return { 
      stories: stories,
      error: null 
    }
  }
  catch (error) {
    return { stories: null, error: error }
  }
}


/**
 * @function findStoriesOfFollowing
 * @description Query to find stories of authors that the user is following
 * @param {String} user - User hash
 * @returns {Promise} - Promise object represents the stories of authors that the user is following
*/
const findStoriesOfFollowing = async (user) => {
  try {

    const stories = await sequelize.query(followingStories, {
      replacements: { user: user },
      type: Sequelize.QueryTypes.SELECT
    })

    // check if stories is empty
    if (stories.length <= 0) {
      return [];
    }

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      story.you = false;
      return story;
    });

    return storiesData;
  } catch (error) {
    throw error;
  }
}

/**
 * @function findRecentStoriesWhenLoggedIn
 * @description Query to find recently created stories
 * @param {String} user - User hash
 * @returns {Promise} - Promise object represents the stories published recently
*/
const findRecentStoriesWhenLoggedIn = async user => {
  try {
    const stories = await sequelize.query(recentLoggedIn, {
      replacements: { user: user },
      type: Sequelize.QueryTypes.SELECT
    });

    // check if stories is empty
    if (stories.length <= 0) {
      return [];
    }

   // return the stories: map the stories' dataValues
   const storiesData = stories.map(story => {
    story.you = false;
    return story;
  });

    return storiesData;
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function findRecentStoriesWhenLoggedOut
 * @description Query to find recently created stories
 * @param {String} user - User hash
 * @returns {Promise} - Promise object represents the stories published recently
*/
const findRecentStoriesWhenLoggedOut = async () => {
  try {
    const stories = await sequelize.query(recentStories, {
      type: Sequelize.QueryTypes.SELECT
    });

    // check if stories is empty
    if (stories.length <= 0) {
      return [];
    }

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      story.you = false;
      return story;
    });

    return storiesData;
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  fetchRecent
}