// Importing all routes and exporting them as a single object
const authQueries = require('./auth');
const userQueries = require('./users');
const searchQueries = require('./search');
const feedQueries = require('./feeds');
const postQueries = require('./posts');

module.exports = {
  authQueries, userQueries, searchQueries, feedQueries, postQueries
}