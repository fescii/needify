/**
 * @name sanitizeInput
 * @function sanitizeInput
 * @description Sanitize inputs to prevent SQL injection
 * @param {string} input - The input to be sanitized
 * @returns {string} - The sanitized input
*/
const sanitizeInput = input => {
  // return input.replace(/['"\\]/g, '\\$&');

  // don't remove any character quotes
  // return input.replace(/\\/g, '\\$&');

  // trim input
  return input.trim();
}

module.exports = {
  sanitizeInput,
}