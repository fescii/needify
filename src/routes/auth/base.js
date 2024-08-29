const { signin, logout  } = require('../../controllers').authController;
const { register } = require('../../controllers').userController;
const { checkDuplicateUser, checkLogin } = require('../../middlewares').authMiddleware;
/**
 * @function authRoutes
 * @description a modular function that registers all the auth routes
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1' or '/api/v1/auth'
*/
module.exports = (app, url) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Register route
  app.put(
    `${url}/register`,
    checkDuplicateUser,
    register
  );

  //Login route
  app.post(
    `${url}/login`, checkLogin,
    signin
  );

  // Logout route
  app.get('/logout', logout);
};