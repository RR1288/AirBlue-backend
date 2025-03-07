// Import necessary modules
const fs = require('fs');
const Papa = require('papaparse');
const { User } = require('../models/userModel'); 
const addUserFunction = require('./addUserFunction'); // DUNCAN FUNCITON
const addUserToEventFunction = require('./addUserToEventFunction'); // DUNCAN FUNCITON
const processCSVAndAddUsers = require('../utils/csvReader'); 

// Mock the dependencies
jest.mock('fs');
jest.mock('papaparse');
jest.mock('../models/userModel', () => ({
  User: {
    findOne: jest.fn(),
  },
}));
jest.mock('./addUserFunction'); //DUCAN FUNCTION
jest.mock('./addUserToEventFunction'); //DUNCAN FUNCTION

//Functionn being tested
describe('processCSVAndAddUsers', () => {
  const mockCSVData = `
    FirstName,LastName,Email,Country
    John,Doe,john.doe@example.com,USA
    Jane,Smith,jane.smith@example.com,Canada
  `;

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  //First Test: Add user from csv if they don't exist and assign them to an event
  it('Should add a user if they do not exist and assign them to an event', async () => {
    // Mock fs.readFile to return our mock CSV data
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, mockCSVData);
    });

    // Mock PapaParse to parse the CSV data correctly
    Papa.parse.mockImplementation((data, options) => {
      options.complete({
        data: [
          { FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', Country: 'USA' },
          { FirstName: 'Jane', LastName: 'Smith', Email: 'jane.smith@example.com', Country: 'Canada' },
        ],
      });
    });

    // Mock User.findOne to return null (user does not exist)
    User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    // Mock the addUserFunction and addUserToEventFunction to resolve as well
    addUserFunction.mockResolvedValue({});
    addUserToEventFunction.mockResolvedValue({});

    // Call the function we're testing
    await processCSVAndAddUsers('userTest.csv', 1);

    // Assert that addUserFunction and addUserToEventFunction were called the correct number of times
    expect(addUserFunction).toHaveBeenCalledTimes(2);
    expect(addUserToEventFunction).toHaveBeenCalledTimes(2);

    // Check the correct arguments were passed to these functions
    expect(addUserFunction).toHaveBeenCalledWith('John', 'Doe', 'john.doe@example.com', 'USA');
    expect(addUserFunction).toHaveBeenCalledWith('Jane', 'Smith', 'jane.smith@example.com', 'Canada');
    expect(addUserToEventFunction).toHaveBeenCalledWith('john.doe@example.com', 1);
    expect(addUserToEventFunction).toHaveBeenCalledWith('jane.smith@example.com', 1);
  });

  //Second Test: Not add user if already exist
  it('Should not add a user if they already exist in the database', async () => {
    // Mock fs.readFile to return our mock CSV data
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, mockCSVData);
    });

    // Mock PapaParse to parse the CSV data correctly
    Papa.parse.mockImplementation((data, options) => {
      options.complete({
        data: [
          { FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', Country: 'USA' },
        ],
      });
    });

    // Mock User.findOne to return a user (i.e., the user already exists)
    User.findOne.mockResolvedValueOnce({ UserID: 1, Email: 'john.doe@example.com' });

    // Mock the addUserFunction and addUserToEventFunction to resolve as well
    addUserFunction.mockResolvedValue({});
    addUserToEventFunction.mockResolvedValue({});

    // Call the function we're testing
    await processCSVAndAddUsers('userTest.csv', 1);

    // Assert that addUserFunction was not called for the existing user
    expect(addUserFunction).toHaveBeenCalledTimes(0);

    // Assert that addUserToEventFunction was called for the existing user
    expect(addUserToEventFunction).toHaveBeenCalledTimes(1);
    expect(addUserToEventFunction).toHaveBeenCalledWith('john.doe@example.com', 1);
  });

  //Third Test: Handel CSV Errors
  it('Should handle CSV parsing errors gracefully', async () => {
    // Simulate a CSV parsing error
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, 'invalid,csv,data'); // Invalid CSV format
    });

    // Call the function and catch any errors
    await expect(processCSVAndAddUsers('userTest.csv', 1)).rejects.toThrow();

    // Check that PapaParse was called
    expect(Papa.parse).toHaveBeenCalled();
  });
});
