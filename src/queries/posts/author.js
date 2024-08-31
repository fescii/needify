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
  
  // check if user is logged in
  if (user === null){
    // set the posts
    return await findPostsWhenLoggedOut(where, order, limit, offset);
  }
  else if (user === hash) {
    // set the posts
    return await findUserPosts(where, order, limit, offset);
  }
  else if (user !== null) {
    // set the posts
    return await findPostsWhenLoggedIn(where, order, user, limit, offset);
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

  // check if user is logged in
  return user ?  await findFollowersWhenLoggedIn(where, order, user, limit, offset) : await findFollowersWhenLoggedOut(where, order, limit, offset);
}

/**
 * @function findFollowingByAuthor
 * @description a function that finds following by author in the database: 10 at a time ordered by the date created
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
  // check if user is logged in
  return user ? await findFollowingWhenLoggedIn(where, order, user, limit, offset) : await findFollowingWhenLoggedOut(where, order, limit, offset);
}

// Export the module
module.exports = {
  findPostsByAuthor, findFollowersByAuthor, findFollowingByAuthor
};