// Import necessary modules, middlewares, and controllers
const {
  search, searchUsers, searchPosts
} = require('../../controllers').searchController;

const {
  checkToken
} = require('../../middlewares').authMiddleware;


/**
 * @function topicRoutes
 * @description a modular function that registers all the story routes(search) to the app
 * @param {Object} app - The express app
 * @returns {void} - No return
*/
module.exports = app => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  // Route for handling search
  app.get('/search', checkToken, search);

  // Route for handling search replies
  app.get('/api/v1/q/posts', checkToken, searchPosts);

  // Route for handling search people
  app.get('/api/v1/q/people', checkToken, searchUsers);
}