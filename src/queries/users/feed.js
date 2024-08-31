// Import models
const { Sequelize, sequelize} = require('../../models');
const { usersLoggedIn, usersLoggedOut } = require('../raw').user;

/**
 * @function fetchUsers
 * @description Query to finding trending users
 * @param {Object} reqData - The request data
 * @returns {Object} - The people object or null, and the error if any
*/
const fetchUsers = async reqData => {
  const { user, limit, page } = reqData;

  // calculate the offset and limit
  const offset = (page - 1) * limit;

  return user ? await fetchPeopleWhenLoggedIn(user, offset, limit) : await fetchPeopleWhenLoggedOut(offset, limit);
}

/**
 * @function fetchUsersWhenLoggedIn
 * @description Query to finding trending users when logged in
 * @param {String} user - The user hash
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The people object or null, and the error if any
*/
const fetchPeopleWhenLoggedIn = async (user, offset, limit) => {
  const people = await sequelize.query(usersLoggedIn, {
    replacements: {
      user, 
      offset, 
      limit 
    },
    type: Sequelize.QueryTypes.SELECT
  });

  // Check if the people
  if (people.length < 1 && people.length < 1) {
    return {
      people: [],
    }
  }

  // return the people:
  return people.map(person => {
    person.you = user === person.hash;
    return people;
  });
}

/**
 * @function fetchPeopleWhenLoggedOut
 * @description Query to finding trending people when logged out
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The people object or null, and the error if any
*/
const fetchPeopleWhenLoggedOut = async (offset, limit) => {
  const people = await sequelize.query(usersLoggedOut, {
    replacements: { 
      offset: offset,
      limit: limit
    },
    type: Sequelize.QueryTypes.SELECT
  });

  // return the people
  return people.map(person => {
    person.you = false;
    return person;
  });
}

// Export all queries as a single object
module.exports = {
  fetchUsers
}