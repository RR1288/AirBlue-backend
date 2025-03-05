// csvReader.js

// Make functions for reading a CSV and checking the DB/creating a base account for them

const Papa = require('papaparse');
const fs = require('fs');
const { Client } = require('pg');

// Setup DB connection
const db = new Client({
  host: '127.0.0.1',
  port: 5432,  // Default PostgreSQL port
  user: 'airblue',
  password: 'AirBlue@2025',
  database: 'development_db'
});

// Connect to DB
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

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


// Main function to process the CSV file and handle account creation (Call this when needed)
function processCSV(filePath, callback) {
  const file = fs.createReadStream(filePath);

  Papa.parse(file, {
    header: true, // assumes the CSV has headers (email, first_name, last_name, country)
    skipEmptyLines: true,
    complete: function(results) {
      let processedCount = 0;
      results.data.forEach(row => {
        const { email, first_name, last_name, country } = row;

        // Generate a username based on the email
        const username = generateUsername(email);

        // Check if the account exists
        checkIfAccountExists(email, (exists) => {
          if (!exists) {
            // If account doesn't exist, check if the username is unique
            checkIfUsernameExists(username, (usernameExists) => {
              if (usernameExists) {
                console.log(`Username ${username} already exists for ${email}. Modifying username...`);
                
                // Generate a unique username by appending numbers
                let uniqueUsername = username;
                let counter = 1;

                // Keep checking until we find a unique username
                const checkAndCreateAccount = () => {
                  checkIfUsernameExists(uniqueUsername, (exists) => {
                    if (exists) {
                      uniqueUsername = `${username}${counter}`;
                      counter++;
                      checkAndCreateAccount();
                    } else {
                      // Username is unique, now create the account
                      createAccount(first_name, last_name, email, country, uniqueUsername, () => {
                        console.log(`Account successfully created for ${email} with username: ${uniqueUsername}`);
                        processedCount++;
                        if (processedCount === results.data.length) {
                          callback(); // Call the callback when all rows are processed
                        }
                      });
                    }
                  });
                };

                // Start the check for a unique username
                checkAndCreateAccount();
              } else {
                // If the username is unique, create the account
                createAccount(first_name, last_name, email, country, username, () => {
                  console.log(`Account successfully created for ${email} with username: ${username}`);
                  processedCount++;
                  if (processedCount === results.data.length) {
                    callback(); // Call the callback when all rows are processed
                  }
                });
              }
            });
          } else {
            console.log(`Account already exists for ${email}`);
            processedCount++;
            if (processedCount === results.data.length) {
              callback(); // Call the callback when all rows are processed
            }
          }
        });
      });
    }
  });
}


//TESTING FUNCTION (Commenting out for now)

// Call the processCSV function with the path to your CSV file
processCSV('../tests/userTest.csv', () => {
  console.log('All records processed, closing database connection...');
  db.end(); // Close the DB connection after processing
});

// Export the processCSV function
module.exports = {
  processCSV,
  checkIfAccountExists,
  checkIfUsernameExists,
  createAccount,
  generateUsername
};


