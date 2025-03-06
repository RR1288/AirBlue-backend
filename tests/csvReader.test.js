// csvReader.test.js

const csvReader = require('../utils/csvReader');
const mockDb = require('../config/db');

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('Account Check Tests', () => {

  // First Test: Checking if an account exists by email
  it('Should check if an account exists by email', async () => {
    const mockEmail = 'janedoe@example.com';

    mockDb.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT COUNT(*)')) {
        callback(null, { rows: [{ count: 1 }] });
      }
    });

    const exists = await new Promise((resolve) => {
      csvReader.checkIfAccountExists(mockEmail, resolve);
    });

    expect(exists).toBe(true);
  });

  // Second Test: Check if account does not exist by email
  it('Should check if an account exists by email when it does not exist', async () => {
    const mockEmail = 'anakinSkywalker@mustafar.com';

    mockDb.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT COUNT(*)')) {
        callback(null, { rows: [{ count: 0 }] });
      }
    });

    const exists = await new Promise((resolve) => {
      csvReader.checkIfAccountExists(mockEmail, resolve);
    });

    expect(exists).toBe(false);
  });

  // Third Test: Check if username exists
  it('Should check if a username exists', async () => {
    const mockUsername = 'janedoe';

    mockDb.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT COUNT(*)')) {
        callback(null, { rows: [{ count: 1 }] });
      }
    });

    const exists = await new Promise((resolve) => {
      csvReader.checkIfUsernameExists(mockUsername, resolve);
    });

    expect(exists).toBe(true);
  });

  // Fourth Test: Check if username does not exist
  it('Should check if a username exists when it does not exist', async () => {
    const mockUsername = 'younglingSL4Y3R66';

    mockDb.query.mockImplementation((query, values, callback) => {
      if (query.includes('SELECT COUNT(*)')) {
        callback(null, { rows: [{ count: 0 }] });
      }
    });

    const exists = await new Promise((resolve) => {
      csvReader.checkIfUsernameExists(mockUsername, resolve);
    });

    expect(exists).toBe(false);
  });

  // Make sure any lingering asynchronous operations are cleaned up after all tests
  afterAll(async() => {
    // Close the DB connection after all tests are finished
    await csvReader.closeDbConnection();
    jest.clearAllMocks();
  });
});
