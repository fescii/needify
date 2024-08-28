const { 
  validatePost, validateContent, validateEnd, validateLocation, validatePrice
 } = require('../validators').postValidator;

/**
 * @function checkPost
 * @name checkPost
 * @description This middleware validates the post: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkPost = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // Add the validated data to the request object for the next() function
    req.data = await validatePost(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

/**
 * @function checkContent
 * @name checkContent
 * @description This middleware validates the post content: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkContent = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // Add the validated data to the request object for the next() function
    req.data = await validateContent(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    }); 
  }
}

/**
 * @function checkEnd
 * @name checkEnd
 * @description This middleware validates the post end: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function 
 * @returns {Object} - Returns response object
*/
const checkEnd = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // add the validated data to the request object for the next() function
    req.data = await validateEnd(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

/**
 * @function checkLocation
 * @name checkLocation
 * @description This middleware validates the post location: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function 
 * @returns {Object} - Returns response object
*/
const checkLocation = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // add the validated data to the request object for the next() function
    req.data = await validateLocation(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

/**
 * @function checkPrice
 * @name checkPrice
 * @description This middleware validates the post price: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function 
 * @returns {Object} - Returns response object
*/
const checkPrice = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  try {
    // add the validated data to the request object for the next() function
    req.data = await validatePrice(req.body);
    await next();
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  checkPost, checkContent,
  checkEnd, checkLocation, checkPrice,
};