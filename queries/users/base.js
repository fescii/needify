// import MODULES
const bcrypt = require('bcrypt');
const {  models } = require('../../models');
const {Sequelize, Op} = require('sequelize')

const { salt_rounds } = require("../../configs").envConfig;

const User = models.User;

/**
 * @function addUser
 * @description Query to add a new user
 * @param {Object} data - The user data
 * @param {String} data.name - The name of the user
 * @param {String} data.email - The email of the user
 * @param {String} data.password - The password of the user
 * @param {String} data.hash - The username(hash) of the user
 * @returns {Object} - The user object or null, and the error if any
*/
const addUser = async (data) => {
  // Trying to create new user to the database
  const user = await User.create({
    name: data.name,
    email: data.email,
    hash: data.hash,
    password: await bcrypt.hash(data.password, salt_rounds)
  });

  // On success return data
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    hash: user.hash
  }
}

/**
 * @function checkIfUserExits
 * @description Query to check if a user exists
 * @param {Object} data - The data of the user
 * @param {String} data.email - The email of the user
 * @param {String} data.hash - The hash of the user
 * @returns {Object} - The user object or null, and the error if any
*/
const checkIfUserExits = async data => {
  const { email, hash } = data;

   // Find the user by email
   const user = await User.findOne({ 
    where: {
      [Op.or]: [ { email: email }, { hash: hash } ] 
    } 
  });
  
  // If user is not found return null
  if (!user) return null;

  // Return the user
  return user;
}

/**
 * @function getUserByHash
 * @description Query to get a user by hash
 * @param {String} hash - The hash of the user
 * @param {String} currentUser - The hash of the current user
 * @returns {Object} - The user object or null, and the error if any
*/
const getUserByHash = async (hash, currentUser) => {
  // check if the current user is logged in
  if (currentUser) {
    return getUserWhenLoggedIn(hash, currentUser);
  }
  else {
    return getUser(hash);
  }
}

/**
 * @function getUser
 * @description Query to get a user by hash
 * @param {String} hash - The hash of the user
 * @returns {Object} - The user object or null, and the error if any
*/
const getUser = async (hash, you=false) => {
  // Find the user by hash
  const user = await User.findOne({ 
    attributes: ['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email', 'contact'],
    where: { hash } 
  });

  // If user is not found return null
  if (!user) {
    return null;
  }

  // Return the user
  const data  = user.dataValues;

  // add is following to the user
  data.is_following = false;

  // if you are the user
  data.you = you;

  return data;
}

/**
 * @function getUserWhenLoggedIn
 * @description Query to get a user by hash
 * @param {String} hash - The hash of the user to get
 * @param {String} currentUser - The hash of the current user
*/
const getUserWhenLoggedIn = async (hash, currentUser) => {
  // check if hash and current user are the same
  if (hash === currentUser) {
    return getUser(hash, true);
  }
  // Find the user by hash
  const user = await User.findOne({ 
    attributes:['hash', 'bio', 'name', 'email', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'contact',
      [
        Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = users.hash AND connects.from = '${currentUser}')`)),
        'is_following'
      ],
    ],
    where: { hash }
  });


  // If user is not found return null
  if (!user) {
    return null
  }

  // Return the user
  const data  = user.dataValues;

  // if you are the user
  data.you = false;

  return data
}

/**
 * @function getUserProfile
 * @description Query to get a user by hash
 * @param {String} hash - The hash of the user to get
 * @param {String} currentUser - The hash of the current user
*/
const getUserProfile = async hash => {
  // Find the user by hash
  const user = await User.findOne({ 
    attributes:['hash', 'bio', 'name', 'email', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', "contact", 'contact'],
    where: { hash }
  });

  // If user is not found return null
  if (!user) {
    return null;
  }

  return user.dataValues;
}

/**
 * @module findAuthorInfo
 * @description a module that finds the author contact information: an object field
 * @param {String} hash - The author hash
 * @returns {Object} contact - The author contact object || null || error
*/
const findAuthorInfo = async hash => {
  // Find the user by hash
  const user = await User.findOne({ 
    attributes:['hash', 'bio', 'name', 'email', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', "contact", 'contact'],
    where: { hash }
  });

  // If user is not found return null
  if (!user) {
    return null;
  }

  return user.dataValues;
}


// Export the queries
module.exports = {
  addUser, getUserByHash, getUserProfile,
  checkIfUserExits, findAuthorInfo
};