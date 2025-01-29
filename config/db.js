const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');


const env = process.env.NODE_ENV || 'development';
dotenv.config();
let DB_NAME;

 
switch (env) {
  case 'development':
    DB_NAME = process.env.DB_NAME_DEVELOPMENT
    break;
  case 'production':
    DB_NAME = process.env.DB_NAME_PRODUCTION
    break;
  case 'test':
    DB_NAME = process.env.DB_NAME_TEST
    break;
  
  default:
    break;
}


// Setup PostgreSQL connection
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: DB_NAME,
  port: process.env.DB_PORT,
  dialect: 'postgres',
});

module.exports = { sequelize };
