const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');


const env = process.env.NODE_ENV || 'development';
dotenv.config();



// Setup PostgreSQL connection
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: 'postgres',
});

module.exports = { sequelize };
