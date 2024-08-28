// Story all routes

const { checkToken } = require('../../middlewares').authMiddleware;

const {
  findAuthorPosts, findUserFollowers, findUserFollowing
} = require('../../controllers').postController;

/**
 * @function feedsRoutes
 * @description a modular function that registers all feeds for posts
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1'=
 * @returns {void}
*/
module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });
  
  // Route for finding all posts by an author
  app.get(`${url}/u/:hash/posts`, checkToken, findAuthorPosts);

  // Route for finding all followers of a user
  app.get(`${url}/u/:hash/followers`, checkToken, findUserFollowers);

  // Route for finding all users a user is following
  app.get(`${url}/u/:hash/following`, checkToken, findUserFollowing);
}