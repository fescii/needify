// Importing the required modules, fns, configs, and utils...
const { sequelize, models } = require('../../models');
const { tokenUtil } = require("../../utils");

const { findPostWhenLoggedIn, findPostWhenLoggedOut } = require('./helper');

const Post = models.Post;
const generateHash = tokenUtil.generateHash;


/**
 * @function addPost
 * @description a function that adds a new post to the database
 * @param {Object} user - The user object(id, email, hash)
 * @param {Object} data - The post data object
 * @returns {Object} data - The added post object and error if any
*/
const addPost = async (user, data) => {
  // add author to the data object
  data.author = user.hash;

  // Generate a hash for the post created
  data.hash = await generateHash(Date.now().toString())

  // Create the post
  const post = await Post.create(data);

  return {
    kind: post.kind,
    author: post.author,
    hash: post.hash,
    content: post.content,
    location: post.location,
    price: post.price,
    views: post.views,
    end: post.end
  }
}

/**
 * @function updatePostStatus
 * @description a function that publishes a post: basically changes the published status to true
 * @param {Object} data - The data containing the post hash and author
 * @returns {Object} data - The published post object and error if any
*/
const updatePostStatus = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the post
    const post = await Post.findOne({ where: { hash: data.hash, author: data.author } });

    // Check if the post exists
    if (!post) {
      return null;
    }

    // Update the post with the new data: published
    await post.update({ published: true }, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return {
      published: post.published
    }
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // throw an error
    throw error;
  }
}

/**
 * @function checkIfPostExists
 * @description a function that checks if a post exists in the database: using hash
 * @param {String} hash - The post hash
 * @returns {Object} data - The post object and error if any
*/
const checkIfPostExists = async hash => {
  // Find the post
  const post = await Post.findOne({ where: { hash } });

  // Check if the post exists
  if (!post) {
    return null;
  }

  // return the post
  return {
    kind: post.kind,
    author: post.author,
    hash: post.hash,
    content: post.content,
    location: post.location,
    price: post.price,
    views: post.views,
    end: post.end
  }
}

/**
 * @function findPost
 * @description a function that finds a post in the database: using hash
 * @param {String} hash - The post hash
 * @returns {Object} data - The post object and error if any
*/
const findPost = async hash => {
  // Find the post
  const post = await Post.findOne({ where: { hash, published: true } });

  // Check if the post exists
  if (!post) {
    return { post: null, error: null };
  }

  // return the post
  return {
    kind: post.kind,
    author: post.author,
    hash: post.hash,
    content: post.content,
    location: post.location,
    price: post.price,
    views: post.views,
    end: post.end
  }
}

/**
 * @function editPost
 * @description a function that updates a post in the database
 * @param {Object} data - The post data object
 * @returns {Object} data - The updated post object and error if any
*/
const editPost = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the post
    const post = await Post.findOne({ where: { hash: data.hash, author: data.author } });

    // Check if the post exists
    if (!post) {
      return { post: null, error: null };
    }

    // Update the post with the new data: content
    await post.update({ content: data.content }, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return {
      content: post.content
    }
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // return the error
    throw error
  }
}

/**
 * @function editLocation
 * @description a function that updates a post location in the database
 * @param {Object} data - The post data object
 * @returns {Object} data - The updated post object and error if any
*/
const editLocation = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the post
    const post = await Post.findOne({ where: { hash: data.hash, author: data.author } });

    // Check if the post exists
    if (!post) {
      return null;
    }

    // Update the post with the new data: title
    await post.update({ location: data.location }, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return {
      location: post.location
    }
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // return the error
    throw error
  }
}

/**
 * @function editName
 * @description a function that updates a post name in the database
 * @param {Object} data - The post data object
 * @param {String} data.name - The post name
 * @returns {Object} data - The updated post object and error if any
*/
const editName = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the post
    const post = await Post.findOne({ where: { hash: data.hash, author: data.author } });

    // Check if the post exists
    if (!post) {
      return null;
    }

    // Update the post with the new data: title
    await post.update({ name: data.name }, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return {
      name: post.name
    }
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // return the error
    throw error
  }
}

/**
 * @function editPrice
 * @description a function that updates a post price in the database
 * @param {Object} data - The post data object
 * @returns {Object} data - The updated post object and error if any
*/
const editPrice = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the post
    const post = await Post.findOne({ where: { hash: data.hash, author: data.author } });

    // Check if the post exists
    if (!post) return null;

    // Update the post with the new data: price
    await post.update({ price: data.price }, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return {
      price: post.price
    }
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // return the error
    return { post: null, error };
  }
}

/**
 * @function editEnd
 * @description a function that updates a post end date in the database
 * @param {Object} data - The post data object
 * @returns {Object} data - The updated post object and error if any
*/
const editEnd = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the post
    const post = await Post.findOne({ where: { hash: data.hash, author: data.author } });

    // Check if the post exists
    if (!post) return null;

    // Update the post with the new data: price
    await post.update({ end: data.end }, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return {
      end: post.end
    }
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // return the error
    throw error;
  }
}

/**
 * function findPostByHash
 * @description Query to find a topic by slug or hash
 * @param {String} hash - The query of the topic
 * @param {String} user - The user hash
 * @returns {Object} - The topic object or null, and the error if any
*/
const findPostByHash = async (hash, user) => {
  // check if user is logged in
  if (user !== null) {
    return await findPostWhenLoggedIn(hash, user);
  }
  else {
    return await findPostWhenLoggedOut(hash);
  }
}

/**
 * @function removePost
 * @description a function that removes a post from the database
 * @param {Object} data - The data object containing the post hash and author
 * @param {String} data.hash - The post hash
 * @param {String} data.author - The post author
 * @returns {Object} data - The removed true or false and error if any
*/
const removePost = async data => {
  // Destroy the post
  const result = await Post.destroy({ where: { hash: data.hash, author: data.author } });

  // Check if the post was removed
  return result === 1;
}

// Export the module
module.exports = {
  addPost, checkIfPostExists, editName,
  findPost, editPost, editLocation,
  findPostByHash, editPrice, editEnd,
  removePost, updatePostStatus
};