const fs = require('fs');
const readline = require('readline');

// Function to process CSV and check users in the database
exports.processCSV = async (filePath) => {
  try{
    let results = [];
    const stream = fs.createReadStream(filePath);
    const r1 = readline.createInterface({ input: stream, crlfDelay: Infinity });

    for await (let line of r1 ) {
      const values = line.split(",");
      if (values.length >= 2){
        results.push({
          Email: values[0].trim(),
          FirstName: values[1].trim(),
          LastName: values[2].trim(),
        });
      }else if (values.length > 0){
        results.push({
          Email: values[0].trim(),
          FirstName: '',
          LastName: '',
        });
      }
    };
    return results;
  }catch(error){
    throw new Error("failed to read csv");
  }
};

exports.deleteCSV = async (filepath) => {
  try {
    await fs.promises.unlink(filepath);
  } catch (err) {
    throw new Error('failed to delete csv');
  }
};