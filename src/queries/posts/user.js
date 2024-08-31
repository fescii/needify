// Importing the required modules, fns, configs, and utils...
const { Sequelize, models } = require('../../models');
const { Post, User, Connect } = models;


/**
 * @function findUserPost
 * @description a function that queries posts when user is logged in
 * @param {String} hash - The hash of the post
 * @returns {Object} data - The post object and error if any
*/
const findUserPost = async hash => {
  // Find the post
  const post = await Post.findOne({
    attributes : ['kind', 'author', 'name', 'content', 'location', 'hash', 'price', 'views', 'end', 'createdAt', 'updatedAt'],
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
  data.you = true;

  // return the post
  return data;
}

/**
 * @function findUserPosts
 * @description a function that queries posts when user is logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The posts object and error if any
*/
const findUserPosts = async (where, order, limit, offset) => {
  const posts = await Post.findAll({
    attributes : ['kind', 'author', 'name', 'content', 'location', 'hash', 'price', 'views', 'end', 'createdAt', 'updatedAt'],
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
    // add you to the post data
    data.you = true;

    return data;
  })
}

/**
 * @function findFollowersWhenLoggedIn
 * @description a query function to find all followers/following belonging to a particular user: when logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {String} user - The user hash
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The people object and error if any
*/
const findFollowersWhenLoggedIn = async (where, order, user, limit, offset) => {
  // Find the people from the connect table including the user
  const connects = await Connect.findAll({
    attributes: ['to', 'from', 'createdAt'],
    where: where,
    order: [order],
    limit: limit,
    offset: offset,
    include: [
      {
        model: User,
        as: 'from_user',
        attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'verified', 'email', 'contact',
          [
            Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = from_user.hash AND connects.from = '${user}')`)),
            'is_following'
          ],
        ]
      },
    ]
  });

  // Check if the connects exist
  if (connects.length === 0) {
    return null;
  }

  return connects.map(connect => {
    return {
      createdAt: connect.createdAt,
      you: connect.from_user.hash === user,
      ...connect.from_user.dataValues,
    }
  });
}

/**
 * @function findFollowingWhenLoggedIn
 * @description a query function to find all followers/following belonging to a particular user: when logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {String} user - The user hash
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The people object and error if any
*/
const findFollowingWhenLoggedIn = async (where, order, user, limit, offset) => {
  // Find the people from the connect table including the user
  const connects = await Connect.findAll({
    attributes: ['to', 'from', 'createdAt'],
    where: where,
    order: [order],
    limit: limit,
    offset: offset,
    include: [
      {
        model: User,
        as: 'to_user',
        attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'verified', 'email', 'contact',
          [
            Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = to_user.hash AND connects.from = '${user}')`)),
            'is_following'
          ],
        ]
      },
    ]
  });

  // Check if the connects exist
  if (connects.length === 0) {
    return null;
  }

  return connects.map(connect => {
    return {
      createdAt: connect.createdAt,
      you: connect.to_user.hash === user,
      ...connect.to_user.dataValues,
    }
  });
}

/**
 * @function findFollowersWhenLoggedOut
 * @description a query function to find all followers/following belonging to a particular user: when logged out
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The people object and error if any
*/
const findFollowersWhenLoggedOut = async (where, order, limit, offset) => {
  // Find the people from the connect table
  const connects = await Connect.findAll({
    attributes: ['to', 'from', 'createdAt'],
    where: where,
    order: [order],
    limit: limit,
    offset: offset,
    include: [
      {
        model: User,
        as: 'from_user',
        attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'verified', 'email', 'contact']
      },
    ]
  });

  return connects.map(connect => {
    return {
      createdAt: connect.createdAt,
      you: false,
      ...connect.from_user.dataValues,
    }
  });
}

/**
 * @function findFollowingWhenLoggedOut
 * @description a query function to find all followers/following belonging to a particular user: when logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The people object and error if any
*/
const findFollowingWhenLoggedOut = async (where, order, limit, offset) => {
  // Find the people from the connect table including the user
  const connects = await Connect.findAll({
    attributes: ['to', 'from', 'createdAt'],
    where: where,
    order: [order],
    limit: limit,
    offset: offset,
    include: [
      {
        model: User,
        as: 'to_user',
        attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'verified', 'email', 'contact']
      },
    ]
  });

  return connects.map(connect => {
    return {
      createdAt: connect.createdAt,
      you: false,
      ...connect.to_user.dataValues,
    }
  });
}

// Export the module
module.exports = {
  findUserPost, findUserPosts,
  findFollowersWhenLoggedIn, findFollowingWhenLoggedIn,
  findFollowersWhenLoggedOut, findFollowingWhenLoggedOut
};