const fs = require('fs');
const Papa = require('papaparse');
const { User } = require('../models');  // Correct import for Sequelize models
const addUserFunction = require('../services/userService');

// Mock addUserToEventFunction for testing
const addUserToEventFunction = async (email, eventId) => {
  // For testing purposes, just log what would happen
  console.log(`Mock: Adding user ${email} to event ${eventId}`);
};

// Function to process CSV and check users in the database
async function processCSVAndAddUsers(filePath, eventId) {
  // Read the CSV file asynchronously using PapaParse
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Parse the CSV data
    Papa.parse(data, {
      header: true,  // Assumes the first row contains headers
      skipEmptyLines: true,
      complete: async (result) => {
        // Process each row of data
        for (const row of result.data) {
          // Assuming the CSV has these columns: Email, FirstName, LastName, Country
          const { Email, FirstName, LastName, Country } = row;
          console.log(result.data);

          try {
            const user = await User.findOne({
              where: { Email }
            });

            if (!user) {
              // User does not exist, call your function to add the user
              await addUserFunction.registerUserCSV(FirstName, LastName, Email, Country);
              console.log(`User ${Email} added to the database.`);
              // Commented out adding to event for testing
              // await addUserToEventFunction(Email, eventId);
            } else {
              console.log(`User ${Email} already exists. No account created.`);
              // Commented out adding to event for testing
              // await addUserToEventFunction(Email, eventId);
            }
          } catch (error) {
            console.error('Error querying user:', error);
          }
        }
        console.log('CSV file processed successfully.');
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  });
};

// Call the function with the path to your CSV and the event ID
processCSVAndAddUsers('../tests/userTest.csv', 1) // Replace with actual CSV file path and event ID
  .catch((err) => {
    console.error('Error processing CSV:', err);
  });

// Export
module.exports = {
  processCSVAndAddUsers
};
