const bcrypt = require("bcryptjs");
const { where, Op } = require("sequelize");
const { models, sequelize } = require("../models").models;

const { User } = models;

/**
 * @name editPassword
 * @function editPassword
 * @description - A query to edit the password of a user using email as key to search the user
 * @param {String} email - The email of the user
 * @param {String} password - The password of the user
 * @returns {Object} - Returns the user data or an error
*/
const editPassword = async (email, password) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the user
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    // If the user exists
    if (user) {
      // Update the password
      user.password = bcrypt.hashSync(password, 8);
      await user.save({transaction});

      await transaction.commit();

      return { user: user, error: null}
    }
    else {
      return { user: null, error: null}
    }
  }
  catch (error) {
    await transaction.rollback();
    return { user: null, error: error}
  }
}

/**
 * @function userLogin
 * @name userLogin
 * @description A query funtion to login a user
 * @param {String} user-key - The user key: email or username
 * @returns {Object} - Returns the user data or an error
*/
const userLogin = async userKey => {
  return await User.findOne({
    where: {[Op.or]: [{email: userKey}, {hash: userKey}] }
  })
}

// Export the functions as a single object
module.exports = {
  editPassword, userLogin
}