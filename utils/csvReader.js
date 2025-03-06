// csvReader.js

// Make functions for reading a CSV and checking the DB/creating a base account for them

//Set up db constants
const DB_HOST_PRODUCTION = process.env.DB_HOST_PRODUCTION;
const DB_USER_PRODUCTION = process.env.DB_USER_PRODUCTION;
const DB_PASSWORD_PRODUCTION = process.env.DB_PASSWORD_PRODUCTION;
const DB_NAME_PRODUCTION = process.env.DB_NAME_PRODUCTION;

const Papa = require('papaparse');
const fs = require('fs');
const { Client } = require('pg');

// Setup DB connection
const db = new Client({
  host: DB_HOST_PRODUCTION,
  port: 5432,
  user: DB_USER_PRODUCTION,
  password: DB_PASSWORD_PRODUCTION,
  database: DB_NAME_PRODUCTION,
  ssl: {
    rejectUnauthorized: false,
  }
});

// Connect to DB
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database');
  }
})

// Function to close the DB connection
function closeDbConnection() {
  return new Promise((resolve, reject) => {
    db.end(err => {
      if (err) {
        console.error('Error closing the database connection:', err.stack);
        reject(err);  // Reject the promise if there's an error
      } else {
        console.log('Database connection closed');
        resolve();  // Resolve the promise when the connection is closed
      }
    });
  });
}

// Function to check if an account exists by email
function checkIfAccountExists(email, callback) {
  const query = 'SELECT COUNT(*) as count FROM "Users" WHERE "Email" = $1';
  db.query(query, [email], (err, result) => {
    if (err) throw err;
    callback(result.rows[0].count > 0);
  });
}

// Function to check if a username already exists
function checkIfUsernameExists(username, callback) {
  const query = 'SELECT COUNT(*) as count FROM "Users" WHERE "UserName" = $1';
  db.query(query, [username], (err, result) => {
    if (err) throw err;
    callback(result.rows[0].count > 0);
  });
}

// Function to create a light account for the user
function createAccount(firstName, lastName, email, country, username, callback) {
  const currentTime = 'CURRENT_TIMESTAMP'; // Use CURRENT_TIMESTAMP for both createdAt and updatedAt
  const query = `
    INSERT INTO "Users" ("FName", "LName", "Email", "Country", "UserName", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, ${currentTime}, ${currentTime})
  `;
  db.query(query, [firstName, lastName, email, country, username], (err, result) => {
    if (err) throw err;
    console.log(`Account created for: ${email} with username: ${username}`);
    callback(result);
  });
}

// Function to generate a username from the email
// Username can't be null, so for now the username is everything in their email before the @
function generateUsername(email) {
  return email.split('@')[0]; // Extracts part before '@'
}

async function processCSV(filePath, callback) {
  const file = fs.createReadStream(filePath);

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async function(results) {
      let processedCount = 0;
      let totalRows = results.data.length;

      for (let row of results.data) {
        const { email, first_name, last_name, country } = row;
        const username = generateUsername(email);

        const exists = await checkIfAccountExists(email);
        if (!exists) {
          const usernameExists = await checkIfUsernameExists(username);
          if (usernameExists) {
            let uniqueUsername = username;
            let counter = 1;

            while (await checkIfUsernameExists(uniqueUsername)) {
              uniqueUsername = `${username}${counter}`;
              counter++;
            }

            await createAccount(first_name, last_name, email, country, uniqueUsername);
          } else {
            await createAccount(first_name, last_name, email, country, username);
          }
        }
        processedCount++;
        if (processedCount === totalRows) {
          callback();
        }
      }
    }
  });
};

// Export the processCSV function
module.exports = {
  processCSV,
  checkIfAccountExists,
  checkIfUsernameExists,
  createAccount,
  generateUsername,
  closeDbConnection
};


