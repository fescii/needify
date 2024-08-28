const { getFeeds } = require('./feed');
const { home, offline } = require('./public');


// Export the feeds controllers
module.exports = {
  getFeeds, home,offline
}