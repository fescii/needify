// import all author queries from the storyQueues
const { 
  findFollowersByAuthor, findFollowingByAuthor,
  findPostsByAuthor
} = require('../../queries').postQueries;

/**
 * @function findAuthorPosts
 * @description Controller for finding posts by author
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const findAuthorPosts = async(req, res, next) => {
  // get the author hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // check if the author hash is available in the request object
  if (!hash || !page) {
    const error = new Error('Author hash or page is undefined!');
    return next(error);
  }

  // convert the page and total posts to integer with zero fallback
  page = parseInt(page, 10) || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash,
    user,
    page,
    limit: 10
  }

  try {
    // Find the posts
    const data = await findPostsByAuthor(reqData);

    // check if there is no data
    if (data.length === 0) {
      return res.status(404).json({
        success: true,
        data: [],
        message: 'No posts found!'
      });
    }

    // return the response
    return res.status(200).json({
      success: true,
      message: data.posts ? 'Posts found!' : 'No posts found!',
      data
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function findUserFollowers
 * @description Controller for finding followers by author/user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const findUserFollowers = async(req, res, next) => {
  // get the author hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // check if the author hash is available in the request object
  if (!hash || !page) {
    const error = new Error('Author hash or page is undefined!');
    return next(error);
  }

  // convert the page and total followers to integer with zero fallback
  page = parseInt(page, 10) || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash,
    user,
    page,
    limit: 10
  }

  try {
    // Find the followers
    const data = await findFollowersByAuthor(reqData);
    
    // check if there is no data
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: 'No followers found!'
      });
    }

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Followers found!',
      data
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function findUserFollowing
 * @description Controller for finding following by author/user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const findUserFollowing = async(req, res, next) => {
  // get the author hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // check if the author hash is available in the request object
  if (!hash || !page) {
    const error = new Error('Author hash or page is undefined!');
    return next(error);
  }

  // convert the page and total following to integer with zero fallback
  page = parseInt(page, 10) || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash,
    user,
    page,
    limit: 10
  }

  try {
    // Find the following
    const data = await findFollowingByAuthor(reqData);

    // check if there is no data
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: 'No following found!'
      });
    }

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Following found',
      data
    });
  } catch (error) {
    return next(error);
  }
}

// export the controllers
module.exports = {
  findUserFollowers, findUserFollowing, findAuthorPosts
}