// Import necessary modules, middlewares, and controllers
const {
  getPerson, getUserFollowers, getUserFollowing, fetchUser, getUser
} = require('../../controllers').userController;

const {
  checkToken, verifyLogin
} = require('../../middlewares').authMiddleware;

/**
 * @function userRoutes
 * @description a modular function that registers all the user routes
 * @param {Object} app - The express app
 * @returns {void} - No return
*/
module.exports = (app) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  // Route for handling user page
  app.get('/u/:hash', checkToken, getPerson);

  // Route for handling user page
  app.get('/user', verifyLogin, getUser);

  // Route for handling user posts page
  app.get('/u/:hash/posts', checkToken, getPerson);

  // Route for handling user followers page
  app.get('/u/:hash/followers', checkToken, getUserFollowers);

  // Route for handling user following page
  app.get('/u/:hash/following', checkToken, getUserFollowing);

  // Route for handling user fetch page
  app.get('/api/v1/u/:hash/preview', checkToken, fetchUser);
}