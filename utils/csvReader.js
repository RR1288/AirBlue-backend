const fs = require('fs');
const Papa = require('papaparse');
const { User } = require('../models/userModel'); 
const addUserFunction = require('./addUserFunction'); // ADD DUNCAN FUNCTION
const addUserToEventFunction = require('./addUserToEventFunction'); // ADD DUNCAN FUNCTION

// Function to process CSV and check users in the database
async function processCSVAndAddUsers(filePath, eventId) {
  // Read the CSV file asynchronously using PapaParse
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    };

    // Parse the CSV data
    Papa.parse(data, {
      header: true,  // Assumes the first row contains headers
      skipEmptyLines: true,
      complete: async (result) => {
        // Process each row of data
        for (const row of result.data) {
          // Assuming the CSV has these columns: Email, FirstName, LastName, Counntry
          const { Email, FirstName, LastName, Country } = row;

          // Check if user already exists by Email
          const user = await User.findOne({
            where: { Email }
          });;

          if (!user) {
            // User does not exist, call your function to add the user
            await addUserFunction(FirstName, LastName, Email, Country);

            // After adding the user, we need to add them to the event
            await addUserToEventFunction(Email, eventId); // Assuming `Email` is enough to identify the user
          } else {
            await addUserToEventFunction(Email, eventID)
            console.log(`User ${Email} already exists. No accounnt created, but adding to event.`);
          }
        }
        console.log('CSV file processed successfully.');
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  });;
};

// Call the function with the path to your CSV and the event ID
processCSVAndAddUsers('userTest.csv', 1) // Replace with actual CSV file path and event ID
  .catch((err) => {
    console.error('Error processing CSV:', err);
  });

//Export
module.exports = {
  processCSVAndAddUsers
}
