// Import models
const { Post } = require('../../models').models;

/**
 * @function findPostsByQuery
 * @description Query to finding posts by query: using vector search
 * @param {Object} reqData - The request data
 * @returns {Object} - The posts object or null, and the error if any
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
  let posts = await Post.search(queryOptions);

  // check if length is 0
  if (posts.length < 1) {
    return {
      posts: [],
      limit: limit,
      offset: offset,
      last: true,
    }
  }

  const last = posts.length < limit;

  posts = posts.map(post => {
    post.you = user === post.author;
    return post;
  });

  // create a data object
  return {
    posts: posts,
    limit: limit,
    offset: offset,
    last: last,
  }
}


// Export all queries as a single object
module.exports = {
  findPostsByQuery
};