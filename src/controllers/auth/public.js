
/**
 * @controller {get} /join Join
 * @apiName Join
 * @name Join
 * @description This route will render the join page for the app.
*/
const join = async (req, res) => {
  const nextUrl = req.query.next || '/home';
  res.render('pages/logon', {
    data: {
      name: 'join',
      next: nextUrl,
    }
  })
}

/**
 * @controller {get} /login Login
 * @apiName Login
 * @name Login
 * @description This route will render the login page for the app.
*/
const login = async (req, res) => {
  // Get request url
  const url = req.originalUrl;
  const nextUrl = req.query.next || '/home';

  res.render('pages/logon', {
    data: {
      name: 'login',
      next: nextUrl,
      requested: url
    }
  })
}

/**
 * @controller {get} /register Register
 * @apiName Register
 * @name Register
 * @description This route will render the register page for the app.
*/
const register = async (req, res) => {
  // Get request url
  const url = req.originalUrl;
  const nextUrl = req.query.next || '/home';

  res.render('pages/logon', {
    data: {
      name: 'register',
      next: nextUrl,
      requested: url
    }
  })
}


/**
 * @controller {get} /recover/Reset password
 * @apiName Recover
 * @name Recover
 * @description This route will render the recover page for the app.
 * @returns Page: Renders recover page
*/
const recover = async (req, res) => {
  const url = req.originalUrl;
  const nextUrl = req.query.next || '/home';

  res.render('pages/logon', {
    data: {
      name: 'forgot',
      next: nextUrl,
      requested: url
    }
  })
}


// Export all public content controllers
module.exports = {
  join, login, register, recover
}