
/**
 * @controller {get} /search Search
 * @name Search
 * @description This route will render the search page for the app.
*/
const home = async (req, res) => {
  res.render('pages/home', {
    data: {
      name: "Home",
    }
  })
}

/**
 * @controller {get} /offline Offline
 * @name Offline
 * @description This route will render the offline page for the app.
*/
const offline = async (req, res) => {
  res.render('pages/offline', {
    data: {
      name: "Offline",
    }
  })
}

// Export all public content controllers
module.exports = {
  home, offline
}