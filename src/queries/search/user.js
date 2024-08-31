const { User } = require('../../models').models;
/**
 * @function findUsersByQuery
 * @description Query to finding users by query: using vector search
 * @param {Object} reqData - The request data
 * @returns {Object} - The users object or null, and the error if any
*/
const findUsersByQuery = async reqData => {
  const {
    query, user, page, limit
  } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  // trim the query
  let queryStr = query.trim();

  // refine the query: make the query to match containing, starting or ending with the query
  queryStr = queryStr.split(' ').map((q) => `${q.toLowerCase()}:*`).join(' | ');

  // add query to back to the req data
  const queryOptions = {
    user: user,
    query: queryStr,
    offset: offset,
    limit: limit,
  }
  
  // build the query(vector search)
  let users = await User.search(queryOptions);

  users = users.map(author => {
    author.you = author.hash === user;
    return author;
  })

  // create a data object
  return users
}

module.exports = {
  findUsersByQuery
}