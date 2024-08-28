// Importing within the app
const { validateToken } = require('../utils').tokenUtil;
const { validateUser, validateLogin } = require('../validators').authValidator;
const { checkIfUserExits } = require('../queries').userQueries;


/**
 * @function checkDuplicateUser
 * @description - Middleware to check if user with similar email exists
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
const checkDuplicateUser = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  let data;
  let user;

  try {
    data = await validateUser(req.body);
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }


  try {
    user = await checkIfUserExits(data);
    if (user) {
      return res.status(409).send({
        success: false,
        message: "Failed! User with similar email is already exits!"
      });
    }
  } catch (error) {
    return next(error);
  }

  
  // Call next function to proceed with data processing
  req.data = user;
  next();
};

/**
 * @function verifyToken
 * @description - Middleware to verify token(JWT) and add user to the request object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
// Middleware to verify token(JWT)
const verifyToken = async (req, res, next) => {

  // Get jwt token from cookies or headers
  let token = req.cookies['x-access-token'] || req.headers["x-access-token"]

  // If not, token is found in the headers/cookies - return 403(Forbidden)
  if (!token) {
    return res.status(403).send({
      success: false,
      unverified: true,
      message: "You are not authorized!, login to continue"
    })
  }

  const {
    user,
    error
  } = await validateToken(token);

  // If error is returned
  if(error) {
    return res.status(401).send({
      success: false,
      unverified: true,
      message: "Unauthorized!, please login to continue!"
    });
  }

  // Add user to the request object
  req.user = user;
  next();
};


/**
 * @function verifyLogin
 * @description - Middleware to verify token(JWT) and add user to the request object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
// Middleware to verify token(JWT)
const verifyLogin = async (req, res, next) => {

  // Get jwt token from cookies or headers
  let token = req.cookies['x-access-token'] || req.headers["x-access-token"]

  // If not, token is found in the headers/cookies - return 403(Forbidden)
  if (!token) {
    return res.redirect('/join/login');
  }

  const {
    user,
    error
  } = await validateToken(token);

  // If error is returned
  if(error) {
    return res.redirect('/join/login');
  }

  // Add user to the request object
  req.user = user;
  next();
};

/**
 * @function checkToken
 * @description - Middleware to verify token(JWT) and add user to the request object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
// Middleware to verify token(JWT)
const checkToken = async (req, res, next) => {
  // Get jwt token from cookies or headers
  let token = req.cookies['x-access-token'] || req.headers["x-access-token"]

  // If not, token is found in the headers/cookies - return 403(Forbidden)
  if (!token) {
    // add null user to the request object
    req.user = {
      hash: null,
      email: null,
      name: null
    };

    return next();
  }

  const {
    user,
    error
  } = await validateToken(token);

  // If error is returned
  if(error) {
    return res.status(401).send({
      success: false,
      unverified: true,
      message: "Unauthorized!, please login to continue!"
    });
  }

  // Add user to the request object
  req.user = user;
  return next();
};

/**
 * @function checkLogin
 * @name checkLogin
 * @description This middleware validates the user login data: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkLogin = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // Add the validated data to the request object for the next() function
    req.data = await validateLogin(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

// Exporting all the middlewares as a single object
module.exports = {
  checkDuplicateUser,
  verifyToken, checkToken,
  verifyLogin, checkLogin
};