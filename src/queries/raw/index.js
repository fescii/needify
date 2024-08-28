const feedQueries = require('./feed');
const userQueries = require('./user');
const profileQueries = require('./profile');

module.exports = {
  feed: feedQueries,
  user: userQueries,
  profile: profileQueries
}