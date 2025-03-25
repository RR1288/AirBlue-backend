require('dotenv').config();
const logger = require('./logger');
module.exports = {
  development: {
    username: process.env.DB_USER_DEVELOPMENT,
    password: process.env.DB_PASSWORD_DEVELOPMENT,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST_DEVELOPMENT,
    port: parseInt(process.env.DB_PORT, 10) || 5432, // Default to 5432 if DB_PORT is not defined
    dialect: 'postgres',
    logging: msg => logger.info(msg),
  },
  test: {
    username: process.env.DB_USER_DEVELOPMENT,
    password: process.env.DB_PASSWORD_DEVELOPMENT,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_DEVELOPMENT,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: msg => logger.info(msg),
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Heroku Postgres SSL connections
      },
    },
    logging: msg => logger.info(msg),
  },
};
