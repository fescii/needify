// Import necessary modules, middlewares, and controllers
const {
  getFeeds, home, offline, getUsers
} = require('../../controllers').feedController;

const {
  checkToken
} = require('../../middlewares').authMiddleware;


/**
 * @function topicRoutes
 * @description a modular function that registers all feeds routes
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

  // Route for handling(rendering) home page
  app.get('/home', checkToken, home);

  // Route for handling feeds
  app.get('/api/v1/h/feeds', checkToken, getFeeds);

  // Route for handling users
  app.get('/api/v1/h/users', checkToken, getUsers);

  // Route for handling offline page
  app.get('/offline', checkToken, offline);
}