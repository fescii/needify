// Import sanitizeUtil from src/utils/sanitize.util.js
const { sanitizeInput } = require('../utils').sanitizeUtil;

// kind -  options
const kindOptions = ['product', 'service'];

/**
 * @name validatePost
 * @function validatePost
 * @description a validator function that validates post data before being passed to the controllers or middlewares
 * @param {Object} data - The story data object
 * @returns {Object} data - The validated story data object and throws an error if any
*/
const validatePost = async data => {
  // check if name is defined and is a string
  if(!data.name || typeof data.name !== 'string') throw new Error('Name is required and should be a string');

  // Check if the data mandatory fields are present
  if (!data.kind || !data.content || typeof data.kind !== 'string' || typeof data.content !== 'string') {
    throw new Error('Kind and content are required and should be strings')
  }

  // Check if the location and price are present and are valid
  if (!data.location || !data.price || typeof data.location !== 'string' || typeof data.price !== 'number') {
    throw new Error('Location and price are required and should be string and number respectively!')
  }

  // Check if the data kind is valid: check against the StoryType array
  if (!kindOptions.includes(data.kind)) {
    throw new Error('Invalid post kind - type not supported')
  }

  // check if published is present and is a boolean
  if (!data.published || typeof data.published !== 'boolean') {
    throw new Error('Published should be defined and a boolean: true/false')
  }

  // Check if the end is a number and is: >=1
  if (data.end) {
    if (typeof data.end !== 'number' || data.end < 1) {
      throw new Error('End date should be a should be a number from 1');
    }

    // create a date with a timezone and add end as days
    const today = new Date(Date.now());

    data.end = new Date(today.setDate(today.getDate() + data.end));
  }
  
  try {
    // Validate when story type is: post
    return  {
      kind: data.kind,
      name: sanitizeInput(data.name),
      published: data.published,
      content: sanitizeInput(data.content),
      location: sanitizeInput(data.location),
      price: data.price,
      end: data?.end
    }
  } catch (error) {
    // console.log(error);
    throw new Error('An error occurred while validating payload the data');
  }
}


/**
 * @name validateContent
 * @function validateContent
 * @description a validator function that validates post content before being passed to the controllers or middlewares
 * @param {Object} data - The post content object
 * @returns {Object} data - The validated story content object and throws an error if any
*/
const validateContent = async data => {
  // Check if the content is present
  if (!data.content || typeof data.content !== 'string' || data.content.length < 10) {
    throw new Error('Content body is required and should be a string and at least 10 characters');
  }

  try {
    // Validate the content
    const validatedContent = sanitizeInput(data.content);

    // Return the validated content
    return {
      content: validatedContent
    }
  } catch (error) {
    throw new Error('An error occurred while validating the post content')
  }
}

/**
 * @name validateName
 * @function validateName
 * @description a validator function that validates post name before being passed to the controllers or middlewares
 * @param {Object} data - The post name object
 * @param {String} data.name - The post name
 * @returns {Object} data - The validated post name and throws an error if any
*/
const validateName = async data => {
  // Check if the name is present
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Name is required and should be a string');
  }

  try {
    // Validate the name
    const validatedName = sanitizeInput(data.name);

    // Return the validated name
    return {
      name: validatedName
    }
  } catch (error) {
    throw new Error('An error occurred while validating the post name')
  }
}

/**
 * @function validateEnd
 * @description a validator function that validates post end (duration/days valid) before being passed to the controllers or middlewares
 * @param {Object} data - The story data object
 * @returns {Object} data - The validated story post end(days/duration) and throws an error if any
*/
const validateEnd = async data => {
  if (!data.end || typeof data.end !== 'number' || data.end < 1) {
    throw new Error('Durations(end) must be defined and be a number greater than or equals to 1');
  }

  try {
    // create a date with a timezone and add end as days
    const today = new Date(Date.now());

    // Return the validated duration
    return {
      end: new Date(today.setDate(today.getDate() + data.end))
    };

  } catch (error) {
    throw new Error('An error occurred while validating the post duration(end)')
  }
}

/**
 * @validate validatePrice
 * @description a function that validates the post price/bid
 * @param {Object} data - The post price/bid
 * @returns {Object} data - The validated post price and throws an error if any
*/
const validatePrice = async data => {
  // Check if the price are present and are valid
  if ( !data.price || typeof data.price !== 'number') {
    throw new Error('Price is required and should be a number!')
  }

  try {
   return { price: data.price }
  } catch (error) {
    throw new Error('An error occurred while validating the post price')
  }
}

/**
 * @validate validateLocation
 * @description a function that validates the post location
 * @param {Object} data - The post location
 * @returns {Object} data - The validated post location and throws an error if any
*/
const validateLocation = async data => {
  // Check if the location are present and are valid
  if (!data.location || typeof data.location !== 'string') {
    throw new Error('Location is required and should be string!')
  }

  try {
    return { location: data.location }
  } catch (error) {
    throw new Error('An error occurred while validating the post location')
  }
}

module.exports = {
  validatePost, validateContent, validateEnd, validatePrice, validateLocation, validateName
}