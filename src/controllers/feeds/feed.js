// import all queries from the storyQueues
const {
  fetchFeeds
} = require('../../queries').feedQueries;

/**
 * @function getFeeds
 * @description Controller for finding all feeds
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getFeeds = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    user,
    page: parseInt(page),
    limit: 10
  }

  try {
    // Find the stories
    const data = await fetchFeeds(reqData);

    // check length of the data
    if (data.length === 0) {
      return res.status(404).json({
        success: true,
        last: true,
        message: 'No feeds found'
      });
    }

    // if feeds is less than 10
    if (data.length < 10) {
      return res.status(200).json({
        success: true,
        last: true,
        message: 'Feeds fetched successfully',
        data
      });
    }

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Feeds fetched successfully',
      data
    });
  } catch (error) {
    return next(error);
  }
}

// export the controllers
module.exports = {
  getFeeds
}