// Importing validator files and exporting them as a single object
const authValidator = require('./auth');
const userValidator = require('./user');
const postValidator = require('./post');

module.exports = {
  authValidator, postValidator, userValidator
};