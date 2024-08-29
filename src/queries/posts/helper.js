// Importing the required modules, fns, configs, and utils...
const { Sequelize, models } = require('../../models');
const { Post, User } = models;

/**
 * @function findPostWhenLoggedIn
 * @description a function that queries posts when user is logged in
 * @param {String} hash - The hash of the post
 * @param {String} user - The hash of the user
 * @returns {Object} data - The post object and error if any
*/
const findPostWhenLoggedIn = async (hash, user) => {
  // Find the post
  const post = await Post.findOne({
    attributes : ['kind', 'author', 'content', 'location', 'hash', 'price', 'views', 'end', 'createdAt', 'updatedAt'],
    where: { hash },
    include: [
      {
        model: User,
        as: 'post_author',
        attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'verified', 'email', 'contact',
          [
            Sequelize.fn('EXISTS', Sequelize.literal(`( SELECT 1 FROM account.connects WHERE connects.to = post_author.hash AND connects.from = '${user}')`)),
            'is_following'
          ]
        ],
      }
    ],
  });

  // return the post
  const data = post.dataValues;
  data.post_author = post?.post_author.dataValues;

  // add you you to the post
  data.you = user === data.author;

  // return the post
  return data;
}

/**
 * @function findPostWhenLoggedOut
 * @description a function that queries posts when user is logged out
 * @param {String} hash - The hash of the post
 * @returns {Object} data - The post object and error if any
*/
const findPostWhenLoggedOut = async hash => {
  // Find the post
  const post = await Post.findOne({
    attributes : ['kind', 'author', 'content', 'location', 'hash', 'price', 'views', 'end', 'createdAt', 'updatedAt'],
    where: { hash },
    include: [
      {
        model: User,
        as: 'post_author',
        attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'verified', 'email', 'contact'],
      }
    ],
  });
  // return the post
  const data = post.dataValues;

  // add you you to the post
  data.you = false;

  // return the post
  return data
}


/**
 * @function findPostsWhenLoggedIn
 * @description a function that queries posts when user is logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {String} user - The user hash
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The posts object and error if any
*/
const findPostsWhenLoggedIn = async (where, order, user, limit, offset) => {
  // Find the posts
  const posts = await Post.findAll({
    attributes : ['kind', 'author', 'content', 'location', 'hash', 'price', 'views', 'end', 'createdAt', 'updatedAt' ],
    where: where,
    order: [order],
    limit: limit,
    offset: offset,
    include: [
      {
        model: User,
        as: 'post_author',
        attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'verified', 'email', 'contact',
          [
            Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = post_author.hash AND connects.from = '${user}')`)),
            'is_following'
          ]
        ],
      }
    ],
  });
  // return the posts
  return posts.map(post => {
    const data = post.dataValues;
    data.post_author = post.post_author.dataValues;
    data.you = user === data.author;

    return data;
  })
}

/**
 * @function findPostsWhenLoggedOut
 * @description a function that queries posts when user is logged out
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The posts object and error if any
*/
const findPostsWhenLoggedOut = async (where, order, limit, offset) => {
  // Find the posts
  const posts = await Post.findAll({
    attributes : ['kind', 'author', 'content', 'location', 'hash', 'price', 'views', 'end', 'createdAt', 'updatedAt'],
    where: where,
    order: [order],
    limit: limit,
    offset: offset,
    include: [
      {
        model: User,
        as: 'post_author',
        attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'verified', 'email', 'contact'],
      }
    ],
  });

  // return the posts
  return posts.map(post => {
    const data = post.dataValues;
    data.you = false;

    return data;
  })
}

// Export the module
module.exports = {
  findPostWhenLoggedIn, findPostWhenLoggedOut, findPostsWhenLoggedIn, findPostsWhenLoggedOut
};