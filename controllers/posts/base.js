
const { Privileges } = require('../../configs').platformConfig;
const {
  addPost, editLocation, editPost, editPrice, editEnd, updatePostStatus, removePost
} = require('../../queries').postQueries;


/**
 * @function createPost
 * @description Controller for creating a new post
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const createPost = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.data) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  try {
    // Add post to the database
    const post = await addPost(req.user, req.data);

    // Return the response
    return res.status(201).send({
      success: true,
      post: post,
      message: "Post was added successfully!",
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function publishPost
 * @description Controller for publishing a post content
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object || or calls next middleware
*/
const publishPost = async (req, res, next) => {
  // Check if the params or payload is available
  const { hash } = req.params;

  if (!req.user) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // create data
  const data = {
    author: req.user.hash,
    hash: hash
  }

  try {
    // Publish the post content
    const post = await updatePostStatus(data);

    // Check if post was not found
    if (!post) {
      // Return the 404 response
      return res.status(404).send({
        success: false,
        message: "Post not you are trying to publish was not found!"
      });
    }

    // Return success response
    return res.status(200).send({
      success: true,
      post: post,
      message: "Post content was published successfully!",
    });
  } catch (error) {
    return next(error);
  }
}


/**
 * @function updatePost
 * @description Controller for updating post content
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updatePost = async (req, res, next) => {
  // Check if the params or payload is available
  const { hash } = req.params;

  if (!req.data || !hash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // create data
  const data = req.data;

  // add author and post hash to the data
  data.author = req.user.hash;
  data.hash = hash;

  // Update the post content
  const post = await editPost(data);

  try {
    // Check if post was not found
  if (!post) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Post not you are trying to update was not found!"
    });
  }
  // Return success response
  return res.status(200).send({
    success: true,
    post: post,
    message: "Post content was updated successfully!",
  });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function updateLocation
 * @description Controller for updating post location
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 */
const updateLocation = async (req, res, next) => {
  // Check if the params or payload is available
  const { hash } = req.params;

  if (!req.data || !hash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // add author and post hash to the data
  const data = req.data;
  data.author = req.user.hash;
  data.hash = hash;

  try {
    // Update the post loaction
  const post = await editLocation(data);

  // Check if post was not found
  if (!post) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Post not you are trying to update was not found!"
    });
  }

  // Return success response
  return res.status(200).send({
    success: true,
    post: post,
    message: "Post loaction was updated successfully!",
  });
  } catch (error) {
    return next(error);
  }
}


/**
 * @function updatePrice
 * @description Controller for updating post price
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updatePrice = async (req, res, next) => {
  // Check if the params or payload is available
  const { hash } = req.params;

  if (!req.data || !hash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // add author and post hash to the data
  const data = req.data;
  data.author = req.user.hash;
  data.hash = hash;

  try {
    // Update the post price
  const post = await editPrice(data);

  // Check if post was not found
  if (!post) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Post not you are trying to update was not found!"
    });
  }
  
  // Return success response
  return res.status(200).send({
    success: true,
    post: post,
    message: "Post price was updated successfully!",
  });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function updateEnd
 * @description Controller for updating post end date
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateEnd = async (req, res, next) => {
  // Check if the params or payload is available
  const { hash } = req.params;

  if (!req.data || !hash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // add author and post hash to the data
  const data = req.data;
  data.author = req.user.hash;
  data.hash = hash;

  try {
    // Update the post end date
  const post = await editEnd(data);

  // Check if post was not found
  if (!post) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Post not you are trying to update was not found!"
    });
  }
  
  // Return success response
  return res.status(200).send({
    success: true,
    post: post,
    message: "Post end date was updated successfully!",
  });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function deletePost
 * @description Controller for deleting a post
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const deletePost = async (req, res, next) => {
  // Check if the params is available
  const { hash } = req.params;

  if (!req.user || !hash) {
    const error = new Error('Params data or payload is undefined!');
    return next(error)
  }

  try {
    // Remove the post
  const deleted = await removePost({ author: req.user.hash, hash });

  // Check if post was not found
  if (!deleted) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Post you are trying to delete was not found!"
    });
  }

  // Return success response
  return res.status(200).send({
    success: true,
    message: "Post was deleted successfully!",
  });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPost, updatePost, deletePost,
  updateLocation, updatePrice, updateEnd,
  publishPost, deletePost
}