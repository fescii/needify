const { sanitizeInput } = require('../utils').sanitizeUtil;

/**
 * @function validatePassword
 * @name validatePassword
 * @description A validator function to validate password before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated password object
 * @returns {Error} - The error object
*/
const validatePassword = async (data) => {
  //check if password is provided
  if (!data.password || !data.old_password) {
    throw new Error("Password and Old password fields are required!");
  }

  if (typeof data.password !== 'string' || data.password.length < 6 || typeof data.old_password !== 'string' || data.old_password.length < 6) {
    throw new Error("Password should have 6 chars or more and must be a string!");
  }

  try {
    return {
      password: sanitizeInput(data.password),
      old_password: sanitizeInput(data.old_password)
    }
  } catch (error) {
    throw new Error("An error occurred validating the payload")
  }
}

/**
 * @function validateEmail
 * @name validateEmail
 * @description A validator function to validate Email before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated Email object
 * @returns {Error} - The error object
*/
const validateEmail = async (data) => {
  //check if email is provided
  if (!data.email) {
    throw new Error("Email field is required!");
  }

  //sanitize email
  const email = await sanitizeUtil.sanitizeInput(data.email)

  // validate email
  // noinspection RegExpRedundantEscape
  let validRegex = /^[\w.-]+@[\w-]+\.[\w.-]+$/

  if (!email.match(validRegex)){
    throw new Error("Invalid email address!");
  }

  return {
    email: email
  }
}

/**
 * @function validateContact
 * @name validateContact
 * @description A validator function to validate Contact before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated Contact object
 * @returns {Error} - The error object
*/
const validateContact = async (data) => {
  //check if contact is provided
  if (!data.contact || typeof data.contact !== 'object') {
    throw new Error("Contact field is required, and must be an object")
  }

  return {
    contact: data.contact
  }
}

/**
 * @function validateBio
 * @name validateBio
 * @description A validator function to validate bio before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated bio object
 * @returns {Error} - The error object
*/
const validateBio = async (data) => {
  //check if bio is provided
  if (!data.bio) {
    throw new Error("Bio field is required!")
  }

  try {
    return {
      bio:  sanitizeUtil.sanitizeInput(data.bio)
    }
  } catch (error) {
    throw new Error("An error occurred validating the payload")
  }
}

/**
 * @function validateName
 * @name validateName
 * @description A validator function to validate name before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated name object or an error object
*/
const validateName = async (data) => {
  //check if name is provided
  if (!data.name) {
    throw new Error("Name is required, and should be at least 2 chars")
  }

  try {
    return {
     name: sanitizeUtil.sanitizeInput(data.name)
    }
  } catch (error) {
    throw new Error("An error occurred validating the payload")
  }
}

// Export all validators
module.exports = {
  validatePassword,
  validateEmail,
  validateContact,
  validateBio,
  validateName
};