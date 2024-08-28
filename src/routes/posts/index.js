// Import all stroy routes and export them as an object
const postRoutes  = require('./base');
const feedsRoutes  = require('./feeds');
const publicRoutes = require('./public');

// Export all routes as a single object
module.exports = app => {
  postRoutes(app, '/api/v1/p');
  feedsRoutes(app, '/api/v1');
  publicRoutes(app);
}