const {Sequelize} = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();
const env = process.env.NODE_ENV || "development";

let sequelize;

if (env === "production") {
    // Heroku's DATABASE_URL contains everything we need for production
    const {DATABASE_URL} = process.env;

    sequelize = new Sequelize(DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // This is needed for SSL connections on Heroku
            },
        },
    });
} else {
    // Local or other environments (development, test)
    const DB_NAME =
        env === "development"
            ? process.env.DB_NAME_DEVELOPMENT
            : process.env.DB_NAME_TEST;

    sequelize = new Sequelize({
        host: process.env.DB_HOST_DEVELOPMENT,
        username: process.env.DB_USER_DEVELOPMENT,
        password: process.env.DB_PASSWORD_DEVELOPMENT,
        database: DB_NAME,
        port: process.env.DB_PORT,
        dialect: "postgres",
    });
}

module.exports = {sequelize};
