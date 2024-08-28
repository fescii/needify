// Import all middlewares and export them as an object
const authMiddleware = require("./auth");
const postMiddleware = require('./post');
const userMiddleware = require('./user');
const upload = require('./upload');

// Export all middlewares as a single object
module.exports = {
  authMiddleware, postMiddleware, upload,
  userMiddleware
};