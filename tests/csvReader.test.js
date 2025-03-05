//csvReader.test.js

//Couple of quick notes for these tests, they mainly only test the DB queries to see if users exist. I didn't want to spam the DB with test users everytime the test is run
//Also there was a lot of weird asynchronus operation errors that happend when I tried to test that so it's just simpler this way

// Set up constants
const csvReader = require('../utils/csvReader'); 
const mockDb = require('../config/db'); 

// Mock the database query method
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

//Testing Time
describe('Account Check Tests', () => {
  
  // First Test: Checking if an account exists by email
  it('Should check if an account exists by email', (done) => {
    const mockEmail = 'janedoe@example.com';

    // Mock db.query to simulate the account existence check
    mockDb.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT COUNT(*)')) {
        callback(null, { rows: [{ count: 1 }] }); 
      }
    });

    // Call the checkIfAccountExists function
    csvReader.checkIfAccountExists(mockEmail, (exists) => {
      // Assert that account exists 
      expect(exists).toBe(true);

      //Signal to end test
      done(); 
    });
  });

  // Second Test: See if a fake account is there via email
  it('Should check if an account exists by email when it does not exist', (done) => {
    const mockEmail = 'anakinSkywalker@mustafar.com';

    // Mock db.query to simulate the account not existing
    mockDb.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT COUNT(*)')) {
        callback(null, { rows: [{ count: 0 }] }); 
      }
    });

    // Call the checkIfAccountExists function
    csvReader.checkIfAccountExists(mockEmail, (exists) => {
      // Assert that account does not exist
      expect(exists).toBe(false);
      
      //End the test
      done();
    });
  });

  // Third Test: Check if user exists via username
  it('Should check if a username exists', (done) => {
    const mockUsername = 'janedoe';

    // Mock db.query to simulate the username existence check
    mockDb.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT COUNT(*)')) {
        callback(null, { rows: [{ count: 1 }] }); 
      }
    });

    // Call the checkIfUsernameExists function
    csvReader.checkIfUsernameExists(mockUsername, (exists) => {
      // Assert that username exists (1 means username is found)
      expect(exists).toBe(true);
      
      //End the test
      done(); 
    });
  });

  // Fourth Test: Check for fake user via username
  it('Should check if a username exists when it does not exist', (done) => {
    const mockUsername = 'younglingSL4Y3R66';

    // Mock db.query to simulate the username not existing
    mockDb.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT COUNT(*)')) {
        callback(null, { rows: [{ count: 0 }] }); 
      }
    });

    // Call the checkIfUsernameExists function
    csvReader.checkIfUsernameExists(mockUsername, (exists) => {
      // Assert that username does not exist
      expect(exists).toBe(false);
      
      //End the test
      done();
    });
  });

});
