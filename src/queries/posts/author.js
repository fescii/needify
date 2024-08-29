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
    posts = await findUserPosts(where, order, limit, offset);
  }
  else if (user !== null) {
    // set the posts
    posts = await findPostsWhenLoggedIn(where, order, user, limit, offset);
  }

  // Check if the posts exist
  if (posts === null) {
    return {
      posts: [],
      limit: limit,
      offset: offset,
      last: true,
    }
  }

  const last = posts.length < limit;

  // create a data object
  return {
    posts: posts,
    limit: limit,
    offset: offset,
    last: last,
  }
}

/**
 * @function findFollowersByAuthor
 * @description a function that finds followers by author in the database: 10 at a time ordered by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The followers object and error if any
*/
const findFollowersByAuthor = async (reqData) => {
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
      limit: limit,
      offset: offset,
      people: [],
      last: true,
    }
  }

  const last = followers.length < limit;

  // create a data object
  return {
    people: followers,
    limit: limit,
    offset: offset,
    last: last,
  }
}

/**
 * @function findFollowingByAuthor
 * @description a function that finds following by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The following object and error if any
*/
const findFollowingByAuthor = async (reqData) => {
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
      limit: limit,
      offset: offset,
      people: [],
      last: true,
    }
  }

  const last = following.length < limit;
  // create a data object
  return {
    people: following,
    limit: limit,
    offset: offset,
    last: last,
  }
}

// Export the module
module.exports = {
  findPostsByAuthor, findFollowersByAuthor, findFollowingByAuthor
};