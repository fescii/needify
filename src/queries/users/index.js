// Import all the queries from the users and export them
const {
  editBio, editContact, editPassword,
  editEmail, editName, editPicture
} = require('./edit');
const { connectToUser } = require('./action');
const { addUser, checkIfUserExits, getUserByHash , findAuthorInfo, getUserProfile } = require('./base');

module.exports = {
  editBio, editContact, editPassword, editEmail, editName, editPicture,
  connectToUser,
  addUser, checkIfUserExits, getUserByHash, findAuthorInfo, getUserProfile,
};