// Post all routes
const { verifyToken } = require('../../middlewares').authMiddleware;
const {
  checkPost, checkContent, checkEnd, checkLocation, checkPrice
} = require('../../middlewares').postMiddleware;
const {
  createPost, updatePost, deletePost, updateLocation,
  updatePrice, updateEnd, publishPost
} = require('../../controllers').postController;

/**
 * @function postRoutes
 * @description a modular function that registers all the post routes
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1' or '/api/v1/s'
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

  // Route for handling creation a new story
  app.put(`${url}/add`,
    [verifyToken, checkPost],
    createPost
  );

  // Route for handling publishing a post
  app.patch(`${url}/:hash/publish`,
    verifyToken, publishPost
  );

  // Route for handling updating story content
  app.patch(`${url}/:hash/edit/content`,
    [verifyToken, checkContent],
    updatePost
  );

  // Route for handling updating story locatio
  app.patch(`${url}/:hash/edit/location`,
    [verifyToken, checkLocation],
    updateLocation
  );

  // Route for handling updating story price
  app.patch(`${url}/:hash/edit/price`,
    [verifyToken, checkPrice],
    updatePrice
  );

  // Route for handling updating story price
  app.patch(`${url}/:hash/edit/end`,
    [verifyToken, checkEnd],
    updateEnd
  );

  // Route for handling story removal/deletion
  app.delete(`${url}/:hash/remove`,
    verifyToken, deletePost
  );
}