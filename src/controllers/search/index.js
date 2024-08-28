const { search } = require('./public')
const { searchPosts} = require('./post');
const { searchUsers } = require('./user');

module.exports = {
  search, searchPosts, searchUsers
}