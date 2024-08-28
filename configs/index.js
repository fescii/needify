// Importing and exporting all configs
const storageConfig = require('./storage.config');
const { envConfig, mapRequestMethod, awsConfig } = require('./env.config');
const hashConfig = require('./hash.config');
const platformConfig = require('./platform.config');
const mailConfig = require('./mail.config');

module.exports = {
  storageConfig, envConfig, mapRequestMethod,
  hashConfig, platformConfig, mailConfig, awsConfig
};