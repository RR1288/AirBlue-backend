const fs = require('fs');
const Papa = require('papaparse');

// Function to process CSV and check users in the database
exports.processCSV = async (filePath) => {
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
        let invitees = [];
        for (const row of result.data) {
          // Assuming the CSV has these columns: Email, FirstName, LastName, Country
          const { email, firstName, lastName } = row;
          console.log(result.data);
          invitees.push({Email: email, FirstName: firstName, LastName: lastName});
          
        }
        console.log('CSV file processed successfully.');
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  });
};

exports.deleteCSV = async (filepath) =>{
  fs.unlink(filepath, (err) =>{
    if (err) throw new Error('failed to delete csv');
  });
}
