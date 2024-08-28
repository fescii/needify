// Importing the required modules
const {
  findPostsWhenLoggedIn, findPostsWhenLoggedOut, 
} = require('./helper');

const {
  findUserPosts, 
  findFollowersWhenLoggedIn, findFollowingWhenLoggedIn,
  findFollowersWhenLoggedOut, findFollowingWhenLoggedOut
} = require('./user');


/**
 * @function findPostsByAuthor
 * @description a function that finds posts by author in the database: 10 at a time ordered by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The posts object and error if any
*/
const findPostsByAuthor = async (reqData) => {
  try {
    const {
      hash, user, page, limit
    } = reqData;

    // Construct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the posts
    const where = { author: hash };
    const order = [['createdAt', 'DESC']];

    // initialize the posts to be null
    let posts = null;

    // check if user is logged in
    if (user === null){
      // set the posts
      posts = await findPostsWhenLoggedOut(where, order, limit, offset);
    }
    else if (user === hash) {
      // set the posts
      posts = await findUserPosts(where, order, user, limit, offset);
    }
    else if (user !== null) {
      // set the posts
      posts = await findPostsWhenLoggedIn(where, order, user, limit, offset);
    }

    // Check if the posts exist
    if (posts === null) {
      return {
        data: {
          posts: [],
          limit: limit,
          offset: offset,
          last: true,
        },
        error: null
      }
    }

    const last = posts.length < limit;

    // create a data object
    const data = {
      posts: posts,
      limit: limit,
      offset: offset,
      last: last,
    }

    // return the posts
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

/**
 * @function findFollowersByAuthor
 * @description a function that finds followers by author in the database: 10 at a time ordered by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The followers object and error if any
*/
const findFollowersByAuthor = async (reqData) => {
  try {
    const {
      hash, user, page, limit
    } = reqData;

    // Construct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the followers
    const where = { to: hash };
    const order = [['createdAt', 'DESC']];

    // initialize the followers to be null
    let followers = null;

    // check if user is logged in
    if (!user){
      followers = await findFollowersWhenLoggedOut(where, order, limit, offset);
    }
    else {
      followers =  await findFollowersWhenLoggedIn(where, order, user, limit, offset); 
    }

    // Check if the followers exist
    if (followers === null) {
      return { 
        data: {
          limit: limit,
          offset: offset,
          people: [],
          last: true,
        }, error: null 
      };
    }

    const last = followers.length < limit;

    // create a data object
    const data = {
      people: followers,
      limit: limit,
      offset: offset,
      last: last,
    }

    // return the followers
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

/**
 * @function findFollowingByAuthor
 * @description a function that finds following by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The following object and error if any
*/
const findFollowingByAuthor = async (reqData) => {
  try {
    const {
      hash, user, page, limit
    } = reqData;

    // Construct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the following
    const where = { from: hash };
    const order = [['createdAt', 'DESC']];

    // initialize the following to be null
    let following = null;

    // check if user is logged in
    if (!user){
      following = await findFollowingWhenLoggedOut(where, order, limit, offset);
    }
    else {
      following =  await findFollowingWhenLoggedIn(where, order, user, limit, offset); 
    }

    // Check if the following exist
    if (following === null) {
      return { 
        data: {
          limit: limit,
          offset: offset,
          people: [],
          last: true,
        }, error: null 
      };
    }

    const last = following.length < limit;
    // create a data object
    const data = {
      people: following,
      limit: limit,
      offset: offset,
      last: last,
    }

    // return the following
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

// Export the module
module.exports = {
  findPostsByAuthor, findFollowersByAuthor, findFollowingByAuthor
};