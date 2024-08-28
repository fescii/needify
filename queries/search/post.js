// Import models
const { Post } = require('../../models').models;

/**
 * @function findPostsByQuery
 * @description Query to finding replies by query: using vector search
 * @param {Object} reqData - The request data
 * @returns {Object} - The replies object or null, and the error if any
*/
const findPostsByQuery = async reqData => {
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
  let replies = await Post.search(queryOptions);

  // check if length is 0
  if (replies.length < 1) {
    return {
      data: {
        replies: [],
        limit: limit,
        offset: offset,
        last: true,
      },
      error: null
    }
  }

  const last = replies.length < limit;

  replies = replies.map(reply => {
    reply.you = user === reply.author;
    return reply;
  });

  // create a data object
  return {
    replies: replies,
    limit: limit,
    offset: offset,
    last: last,
  }
}


// Export all queries as a single object
module.exports = {
  findPostsByQuery
};