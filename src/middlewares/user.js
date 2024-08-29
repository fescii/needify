const { 
  validateBio, validateContact, validateEmail, validateName, validatePassword
 } = require('../validators').userValidator;

/**
 * @function checkBio
 * @name checkBio
 * @description This middleware validates the user bio: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkBio = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // Add the validated data to the request object for the next() function
    req.data = await validateBio(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

/**
 * @function checkContact
 * @name checkContact
 * @description This middleware validates the user contact: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkContact = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // Add the validated data to the request object for the next() function
    req.data = await validateContact(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    }); 
  }
}

/**
 * @function checkEmail
 * @name checkEmail
 * @description This middleware validates the user email: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function 
 * @returns {Object} - Returns response object
*/
const checkEmail = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // add the validated data to the request object for the next() function
    req.data = await validateEmail(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

/**
 * @function checkName
 * @name checkName
 * @description This middleware validates the user name: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function 
 * @returns {Object} - Returns response object
*/
const checkName = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // add the validated data to the request object for the next() function
    req.data = await validateName(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

/**
 * @function checkPassword
 * @name checkPassword
 * @description This middleware validates the user password: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function 
 * @returns {Object} - Returns response object
*/
const checkPassword = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // add the validated data to the request object for the next() function
    req.data = await validatePassword(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  checkBio, checkContact, checkEmail, checkName, checkPassword
};