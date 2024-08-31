// import all queries from the storyQueues
const {
  findUsersByQuery
} = require('../../queries').searchQueries;

/**
 * @function searchUsers
 * @description Controller for finding all users by query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || next middleware || error
*/
const searchUsers = async (req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;
  let query = req.query.q || '';

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    query,
    user,
    page: parseInt(page),
    limit: 10,
  }

  try {
    // Find the users
    const data = await findUsersByQuery(reqData);
    if (data.length === 0) {
      return res.status(404).json({
        success: true,
        data: [],
        message: 'No users found!'
      });
    }

    // return the response
    return res.status(200).json({
      success: true,
      message: data.people.length === 0 ? 'No users found!' : 'Users found!',
      data
    });
  } catch (error) {
    return next(error);
  }
}

// export the controllers
module.exports = { searchUsers }