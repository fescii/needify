// Import base user queries
const { addUser, findAuthorInfo } = require('../../queries').userQueries;

/**
 * @function register
 * @description Controller to register a new user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const register = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.data) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // Get the user data from db;
    const user = await addUser(req.data);

    // On success return response to the user
    return res.status(201).send({
      success: true,
      user: user,
      message: "Your account was registered successfully!"
    });
  } catch (error) {
    return next(error);
  }
};


/**
 * @function getAuthorInfo
 * @description Controller to get author details
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object || pass the error to the next middleware
*/
const getAuthorInfo = async (req, res, next) => {
  // Get the author hash from the request params
  const hash = req.user.hash;

  try {
    // Get the author contact details
    const user = await findAuthorInfo(hash);

    // if user not found
    if(!user) {
      return res.status(404).send({
        success: false,
        message: "User was not found!"
      });
    }

    return res.status(200).send({
      success: true,
      user: user,
      message: "User details found!"
    });
  } catch (error) {
    return next(error);
  }
}


module.exports = {
  register, getAuthorInfo
};