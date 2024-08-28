// import all queries from the storyQueues
const {
  findPostsByQuery
} = require('../../queries').searchQueries;


/**
 * @function searchPosts
 * @description Controller for finding all posts by query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || next middleware || error
*/
const searchPosts = async (req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;
  let query = req.query.q;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    query,
    user,
    page: parseInt(page),
    limit: 10
  }

  try {
    // Find the stories
    const data = await findPostsByQuery(reqData);


    // return the response
    return res.status(200).json({
      success: true,
      message: data.posts.length === 0 ? 'No posts found!' : 'Posts found!',
      data
    });
  } catch (error) {
    return next(error);
  }
}

// export the controllers
module.exports = { searchPosts }