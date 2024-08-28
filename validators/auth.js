const { sanitizeUtil } = require('../utils');

/**
 * @function validateUser
 * @name validateUser
 * @description A validator function to validate user data before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated topic data object
*/
const validateUser = async data => {
  // Check if all required fields are provided
  if (!data.name || !data.username || !data.email || !data.password) {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (Name, Username, email, password)")
  }

  // validate name
  if (typeof data.name !== 'string' || data.name.length < 2) {
    throw new Error("Name should have 2 chars or more and must be a string!")
  }

  // validate username
  if (typeof data.username !== 'string' || data.username.length < 2) {
    throw new Error("Username should have 2 chars or more and must be a string!")
  }

  // validate email
  // noinspection RegExpRedundantEscape
  let validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!data.email.match(validRegex)){
    throw new Error("Invalid email address!")
  }

  // validate password
  if (typeof data.password !== 'string' || data.password.length < 6) {
    throw new Error("Password should have 6 chars or more and must be a string!")
  }

  try {
    return {
      name: sanitizeUtil.sanitizeInput(data.name),
      hash: sanitizeUtil.sanitizeInput(data.username),
      email: sanitizeUtil.sanitizeInput(data.email),
      password: sanitizeUtil.sanitizeInput(data.password)
    }
  } 
  catch (error) {
    throw new Error("There was an error validating user data!")
  }
}

/**
 * @function validateLogin
 * @name validateLogin
 * @description A validator function to validate user data before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated topic data object
*/
const validateLogin = async data => {
  // Check if all required fields are provided
  if (!data.user_key || !data.password) {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (Use key(username/email) and password)")
  }

  // validate username
  if (typeof data.user_key !== 'string') {
    throw TypeError("Email must be text(string)!");
  }

  // validate password
  if (typeof data.password !== 'string') {
    throw new TypeError("Password must be text(string)!");
  }

  try {
    return {
      user_key: sanitizeUtil.sanitizeInput(data.user_key),
      password:  sanitizeUtil.sanitizeInput(data.password)
    }
  } catch {
   throw new Error("Some fields were not provided or contains null values, Ensure you provide: (email, password)");
  }
}

/**
 * @module Export all validators
 * @name Validators
 * @description Export all validators as an object
*/
module.exports = {
  validateUser, validateLogin
}