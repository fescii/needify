// import all auth controllers and export them
const { signin, logout } = require('./base');
const { join, login, register, recover } = require('./public')

// Export all auth controllers
module.exports = {
  login,
  join, register, recover, signin, logout
}