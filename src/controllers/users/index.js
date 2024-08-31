// import all users controllers and export them
const { register, getAuthorInfo } = require('./base');
const { followUser } = require('./action');
const {
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail
} = require('./edit');

const {
  getPerson, getUserPosts, getUserFollowers, getUserFollowing, getAccount, fetchUser, getUser
} = require('./public')


// Export all users controllers
module.exports = {
  register, followUser, getAuthorInfo,
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail,
  getPerson, getUserPosts, getUserFollowers, getUserFollowing,
  getAccount, fetchUser, getUser
}