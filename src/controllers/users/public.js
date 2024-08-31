// Import find topic by hash and by slug
const {
  getUserByHash, getUserProfile
} = require('../../queries').userQueries;


/**
 * @controller {get} /t/:slug(:hash) Topic
 * @name getPerson
 * @description This route will the user page for the app.
 * @returns Page: Renders user page
*/
const getPerson = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  try {
    // query the database for the user
    const user = await getUserByHash(param, req.user.hash);

    // if there is no user, render the 404 page
    if (!user) {
      return res.status(404).render('404')
    }

    // add tab to the user object
    user.tab = 'posts';

    res.render('pages/user', {
      data: user
    })
  } catch (error) {
    return res.status(500).render('500')
  }
}


/**
 * @controller {get} /t/:slug(:hash) Topic
 * @name getUserPosts
 * @description This route will the user - posts.
 * @returns Page: Renders user page
*/
const getUserPosts = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  try {
    // query the database for the user
    const user = await getUserByHash(param, req.user.hash);

    // if there is no user, render the 404 page
    if (!user) {
      return res.status(404).render('404')
    }

    // add tab to the user object
    user.tab = 'posts';

    res.render('pages/user', {
      data: user
    })
  } catch (error) {
    return res.status(500).render('500')
  }
}

/**
 * @controller {get} /u/:hash/followers
 * @name getUserFollowers
 * @description This route will the user page for the app.
 * @returns Page: Renders user page
*/
const getUserFollowers = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  try {
    // query the database for the user
    const user = await getUserByHash(param, req.user.hash);

    // if there is no user, render the 404 page
    if (!user) {
      return res.status(404).render('404')
    }

    // add tab to the user object
    user.tab = 'followers';

    res.render('pages/user', {
      data: user
    })
  } catch (error) {
    return res.status(500).render('500')
  }
}


/**
 * @controller {get} /u/:hash/following
 * @name getUserFollowing
 * @description This route will the user page for the app.
 * @returns Page: Renders user page || error page
*/
const getUserFollowing = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  try {
    // query the database for the user
    const user = await getUserByHash(param, req.user.hash);

    // if there is no user, render the 404 page
    if (!user) {
      return res.status(404).render('404')
    }

    // add tab to the user object
    user.tab = 'following';

    res.render('pages/user', {
      data: user
    })
  } catch (error) {
    return res.status(500).render('500')
  }
}

/**
 * @controller {get} /t/:slug(:hash) Topic
 * @name getPerson
 * @description This route will the user page for the app.
 * @returns Page: Renders user page
*/
const fetchUser = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  try {
    // query the database for the user
    const user = await getUserByHash(param, req.user.hash);

    // if there is no user, render the 404 page
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User found',
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred'
    })
  }
}

/**
 * @controller {get} /user
 * @name getAccount
 * @description This route will the user settings page for the app.
 * @returns Page: Renders settings page || error page
*/
const getAccount = async (req, res) => {
  if (!req.user?.hash) {
    return res.redirect('/join/login?next=/user');
  }

  const hash = req.user.hash;
  let current = req.params.current;


  try {
    const user = await getUserProfile(hash);

    if (!user) {
      return res.status(404).render('404');
    }

    user.contact = {
      email: user.contact?.email || null,
      x: user.contact?.x || null,
      threads: user.contact?.threads || null,
      phone: user.contact?.phone || null,
      link: user.contact?.link || null,
      linkedin: user.contact?.linkedin || null,
    };

    user.tab = current || 'stats';

    res.render('pages/updates', {
      data: user
    });
  } catch (error) {
    return res.status(500).render('500');
  }
}

// Export all public content controllers
module.exports = {
  getPerson, getUserPosts, getUserFollowers, getUserFollowing, getAccount,
  fetchUser
}