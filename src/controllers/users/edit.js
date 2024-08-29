// Import necessary packages and modules
const {
  editPicture, editBio, editContact,
  editPassword, editEmail, editName
} = require('../../queries').userQueries;

/**
 * @name updateProfilePicture
 * @function updateProfilePicture
 * @description A controller function to update a user's profile picture
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfilePicture = async (req, res, next) => {
  // Check if the payload contains a file
  if (!req.user) {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'File or user not found in the payload'
    });
  }
  try {
    // If file is not defined
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'File not found in the payload'
      });
    }

    const userHash = req.user.hash;
    const { path } = req.file;

    // remove public from path
    const newPath = path.replace('public', '/static');

    const user = await editPicture(newPath.toLowerCase(), userHash);

    // Check if user is null
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "The profile you are trying to update does not exist"
      });
    }

    return res.status(200).json({
      success: true,
      user,
      message: 'Your picture updated successfully',
    });

  } catch (error) {
    return next(error);
  }
};


/**
 * @name updateProfileBio
 * @function updateProfileBio
 * @description A controller function to update a user's profile bio
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfileBio = async (req, res, next) => {
  try {
    const userHash = req.user.hash;
    const user = await editBio(req?.data?.bio, userHash);

    // Check if user is null
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "The profile you are trying to update does not exist"
      });
    }

    return res.status(200).json({
      success: true,
      user,
      message: 'Your bio updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};


/**
 * @name updateProfileContact
 * @function updateProfileContact
 * @description A controller function to update a user's profile contact info
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfileContact = async (req, res, next) => {
  try {
    const userHash = req.user.hash;
    const user = await editContact(req?.data?.contact, userHash);

    // Check if user is null
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "The profile you are trying to update does not exist"
      });
    }

    return res.status(200).json({
      success: true,
      user,
      message: 'Your contact updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @name updateProfileEmail
 * @function updateProfileEmail
 * @description A controller function to update a user's profile email
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfileEmail = async (req, res, next) => {
  try {
    const userHash = req.user.hash;
    const user = await editEmail(req?.data?.email, userHash);

    // Check if user is null
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "The profile you are trying to update does not exist"
      });
    }

    return res.status(200).json({
      success: true,
      user,
      message: 'Your email updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @name updateProfilePassword
 * @function updateProfilePassword
 * @description A controller function to update a user's profile password
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfilePassword = async (req, res, next) => {
  try {
    const userHash = req.user.hash;
    const { user, error } = await editPassword(req?.data, userHash);

    // if error: return http validation error status code
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }

    // Check if user is null
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "The profile you are trying to update does not exist"
      });
    }

    return res.status(200).json({
      success: true,
      user,
      message: 'Your password updated successfully',
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * @name updateProfileName
 * @function updateProfileName
 * @description A controller function to update a user's profile name
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfileName = async (req, res, next) => {
  try {
    const userHash = req.user.hash;
    const user = await editName(req.data?.name, userHash);

    // Check if user is null
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "The profile you are trying to update does not exist"
      });
    }

    return res.status(200).json({
      success: true,
      user,
      message: 'Your name updated successfully',
    });
  } catch (error) {
    return next(error);
  }
}

// Export the module
module.exports = {
  updateProfilePicture, updateProfileBio, updateProfileContact,
  updateProfileEmail, updateProfilePassword, updateProfileName
}