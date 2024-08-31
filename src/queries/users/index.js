// Import all the queries from the users and export them
const {
  editBio, editContact, editPassword,
  editEmail, editName, editPicture
} = require('./edit');
const { fetchUsers } = require('./feed');
const { connectToUser } = require('./action');
const { findUserPosts } = require('./profile')
const { addUser, checkIfUserExits, getUserByHash , findAuthorInfo, getUserProfile } = require('./base');

module.exports = {
  editBio, editContact, editPassword, editEmail, editName, editPicture,
  connectToUser, fetchUsers, findUserPosts,
  addUser, checkIfUserExits, getUserByHash, findAuthorInfo, getUserProfile,
};