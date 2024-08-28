// Importing all controllers then exporting them as a single object
const authController = require('./auth');
const errorController = require('./error');
const postController = require('./posts');
const userController = require('./users');
const searchController = require('./search');
const feedController = require('./feeds');
const publicController = require('./public');

/**
 * Exporting all controllers as a single object
*/
module.exports = {
  authController, errorController, postController, userController,
  searchController, feedController,
  publicController
};