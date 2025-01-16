const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Setup PostgreSQL connection
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: false,
});

module.exports = { sequelize };
