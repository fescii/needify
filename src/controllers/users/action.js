// Import user action queries
const { connectToUser } = require('../../queries/users');

/**
 * @function followUser
 * @description Controller to follow a user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const followUser = async (req, res, next) => {
  // Check if the user is available in the request object
  if (!req.user) {
    const error = new Error('User is not defined in the request!');
    return next(error);
  }

  // Get the user hash from the request object
  const userHash = req.user.hash;

  // Get the user hash to follow url params
  let followHash = req.params.hash;

  // Check if the follow hash and user hash are equal
  if (userHash === followHash) {
    return res.status(409).send({
      success: false,
      message: "You cannot follow yourself!"
    })
  }

  try {
    // Get the user data from db;
    const followed = await connectToUser(userHash, followHash);

    // On success return response to the user
    return res.status(201).send({
      success: true,
      followed: followed,
      message: followed ? "You are now following the user!" : "You have unfollow the user!"
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  followUser,
};