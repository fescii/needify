const { dbConfig } = require('../configs').storageConfig;
const Sequelize = require("sequelize");

// Initialize Sequelize with the database configuration
/**
 * @type {Sequelize}
 * @name sequelize
 * @description - This object contains the sequelize instance
 * @property {string} dbConfig.DB - The database name
 * @property {string} dbConfig.USER - The database user
 * @property {string} dbConfig.PASSWORD - The database password
 * @property {string} dbConfig.HOST - The database host
 * @property {string} dbConfig.dialect - The database dialect
 * @property {Object} dbConfig.pool - The database pool configuration
 * @property {Number} dbConfig.pool.max - The database pool max connections
 * @property {Number} dbConfig.pool.min - The database pool min connections
 * @property {Number} dbConfig.pool.acquire - The database pool acquire
 * @property {Number} dbConfig.pool.idle - The database pool idle
*/
let sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    port: dbConfig.PORT,
    "dialectOptions": {
      "ssl": {
        require: true,
        rejectUnauthorized: false
      }
    } ,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    },

    // disable logging : false
    logging: console.log
  }
);

// Importing from account schema models
const {
  User, Code, Connect
} = require('./account')(sequelize, Sequelize);

// Importing story schema models
const { Post } = require('./post')(User, sequelize, Sequelize);

// Import database sync function
const { syncDb } = require('./sync')(sequelize);

const models = { User, Code, Connect, Post }

module.exports = { sequelize, Sequelize, models, syncDb}
