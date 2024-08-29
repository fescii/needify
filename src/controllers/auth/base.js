// Importing from modules
const bcrypt = require("bcryptjs");

// Importing within the app
const { cookie_age } = require('../../configs').envConfig;
const { generateToken } = require('../../utils').tokenUtil;

const { userLogin } = require('../../queries').authQueries;

/**
 * @function signin
 * @description Controller to login a user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
const signin = async (req, res, next) => {
  try {
    // Check if user with that email exists
    const user = await userLogin(req.data.user_key)

    // If no user is found, return 404(Not found)
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "No user found using that email address!"
      });
    }

    // Compare passwords
    let passwordIsValid = bcrypt.compareSync(
      req.data.password,
      user.password
    );

    // If passwords do not match return 401(Unauthorized)
    if (!passwordIsValid) {
      return res.status(401).send({
        success: false,
        message: "Password is incorrect!"
      });
    }

    // generate token
    let token = await generateToken({
      id: user.id, email: user.email,
      hash: user.hash, name: user.name
    });

    // user hash ( this is will be used to check if user is logged in the frontend)
    let userHash = user.hash;

    // Add cookie to the response object
    let options = {
      maxAge: cookie_age,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    }

    // add options for the random token
    let userOptions = {
      maxAge: cookie_age,
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    }

    // Set cookie
    res.cookie('x-access-token', token, options);
    res.cookie('hash', userHash, userOptions);


    // Return a successful response
    return res.status(200).send({
      success: true,
      user,
      accessToken: token,
      message: "You were successfully logged in!"
    });
  } catch (error) {
    return next(error);
  }
  
}

/**
 * @function logout
 * @description Controller to logout a user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Redirect} - Redirects to the login page
*/
const logout = async (req, res, next) => {
  // Clear the cookie
  res.clearCookie('x-access-token');
  res.clearCookie('hash');

  // Redirect to the login page
  return res.redirect('/join');
}


/**
 * Exporting all controllers
*/
module.exports = {
  signin, logout
}