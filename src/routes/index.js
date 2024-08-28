// Init all routes
module.exports = (app) => {
  require('./auth')(app);
  require('./feeds')(app);
  require('./users')(app);
  require('./search')(app);
  require('./public')(app);
  require('./errors')(app);
}