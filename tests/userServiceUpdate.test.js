//userServiceUpdate.test.js

//Set up constants
const { updateUserInfo } = require('../services/userService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { updateUser } = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const { sanitizeName, sanitizeEmail, sanitizeCountry, sanitizeCity,sanitizeState,sanitizePassword } = require('../utils/UserSanitizations'); // Import the function

// Mock the external dependencies
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../controllers/userController', () => ({
  updateUser: jest.fn(),
}));

jest.mock('../utils/responseHelpers', () => ({
  sendError: jest.fn(),
  sendSuccess: jest.fn(),
}));

// Mock the sanitization functions at the top level
jest.mock('../utils/UserSanitizations', () => ({
  sanitizeName: jest.fn(),
  sanitizeEmail: jest.fn(),
  sanitizeCountry: jest.fn(),
  sanitizeCity: jest.fn(),
  sanitizeState: jest.fn(),
  sanitizePassword: jest.fn(),
}));

//Testing time for updateeUserInfo
describe('updateUserInfo', () => {
  let req, res;

  // Suppress console logs to keep it nice and clean
  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  //Set up the req
  beforeEach(() => {
    req = {
      body: {
        fname: 'John',
        lname: 'Doe',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        ktn: '123456',
      },
      headers: {
        authorization: 'Bearer validtoken',
      },
    };

    res = {
      send: jest.fn(),
    };

    sendSuccess.mockClear();
    sendError.mockClear();
    updateUser.mockClear();
    jwt.verify.mockClear();
    sanitizeName.mockClear();  // Clear mock for sanitizeName
  });

  //Test 1: Success if update is good
  it('Should return success when user info is updated correctly', async () => {
    // Mocking JWT verification to return a valid decoded token
    jwt.verify.mockReturnValue({ id: 1 });
  

     // Mock the sanitization functions to return the expected values
    sanitizeName.mockImplementation((value) => {
        if (value === 'John') return 'John'; // Mock for first name
        if (value === 'Doe') return 'Doe';   // Mock for last name
        return value;
    });
    sanitizeCity.mockReturnValue('New York');
    sanitizeState.mockReturnValue('NY');
    sanitizeCountry.mockReturnValue('USA');
    sanitizePassword.mockReturnValue('123456');
  
    // Mock the updateUser function to resolve successfully
    updateUser.mockResolvedValue(true);
  
    // Call the function
    await updateUserInfo(req, res);
  
    // Assert that jwt.verify was called correctly with the token
    expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
  
    // Assert that updateUser was called with the correct arguments
    expect(updateUser).toHaveBeenCalledWith(
      1,  // userID from decoded token
      'John',  
      'Doe',
      'New York',
      'NY',
      'USA',
      '123456'
    );
  
    // Assert that the success response was sent
    expect(sendSuccess).toHaveBeenCalledWith(res, "User was successfully updated");
  });
  

  //Test 2: Error if token is bad
  it('Should return error if JWT token is invalid', async () => {
    // Mocking JWT verification to throw an error (invalid token)
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await updateUserInfo(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Something went wrong while registering user');
  });

  //Test 3: Error if update fails
  it('Should return error if the user update fails', async () => {
    // Mocking JWT verification and updateUser to simulate a failed update
    jwt.verify.mockReturnValue({ id: 1 });
    updateUser.mockResolvedValue(false); // Simulating a failed user update

    await updateUserInfo(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'update failed', 404);
  });

  //Test 4: Error if stuff is missing
  it('Should return error if required fields are missing', async () => {
    // Simulate missing 'fname' in the request body
    req.body.fname = null;

    await updateUserInfo(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "Invalid input for first name", 400);
  });

  //Test 5: Error if sanitization fails
  it('Should return error if sanitization fails', async () => {
    // Simulate sanitization failure for 'fname' by making sanitizeName return null
    sanitizeName.mockReturnValue(null);

    await updateUserInfo(req, res);

    expect(sanitizeName).toHaveBeenCalledWith('John');
    expect(sendError).toHaveBeenCalledWith(res, "Invalid input for first name", 400);
  });
});
