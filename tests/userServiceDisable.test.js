//userServiceDisable.test.js

//Set up constatns
const { disableUserOrganization, disableUserNormalService } = require('../services/userService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const jwt = require('jsonwebtoken');
const { disableUserOrganization: mockDisableUserOrganization, disableUserNormal: mockDisableUserNormal } = require('../controllers/userController');
const { validateUserID } = require('../utils/UserSanitizations');
const {validateOrganizationID} = require('../utils/OrganizationSanitization');

// Mock the dependencies
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../utils/responseHelpers', () => ({
  sendSuccess: jest.fn(),
  sendError: jest.fn(),
}));

jest.mock('../controllers/userController', () => ({
  disableUserOrganization: jest.fn(),
  disableUserNormal: jest.fn(),
}));

jest.mock('../utils/UserSanitizations', () => ({
  validateUserID: jest.fn(),
}));

jest.mock('../utils/OrganizationSanitization', () => ({
    validateOrganizationID: jest.fn(),
}));

//Tests for User Service
describe('User Service', () => {
  
  afterEach(async () => {
    await jest.clearAllMocks(); // Clear mocks between tests to avoid state leakage
  });

  //disableUserOrganization Tests
  describe('disableUserOrganization', () => {

    //Test 1: Disable user from organization
    it('Should disable the user from the organization successfully', async () => {
      const req = {
        body: { userID: 123 },
        headers: { authorization: 'Bearer mockToken' }
      };
      const res = { sendSuccess, sendError };

      // Mock the JWT decode
      jwt.verify.mockReturnValue({ OrganizationID: 456 });
      
      // Mock the validate functions
      validateUserID.mockReturnValue(true);
      validateOrganizationID.mockReturnValue(true);
      
      // Mock the actual disabling function
      mockDisableUserOrganization.mockResolvedValue(true);

      // Call the function
      await disableUserOrganization(req, res);

      // Check that the success response was called
      expect(sendSuccess).toHaveBeenCalledWith(res, "user successfully removed", 200);
    });

    //Test 2: Error if user doesn't exist
    it('Should return an error if the user does not exist', async () => {
      const req = {
        body: { userID: 123 },
        headers: { authorization: 'Bearer mockToken' }
      };
      const res = { sendSuccess, sendError };

      // Mock the JWT decode
      jwt.verify.mockReturnValue({ OrganizationID: 456 });
      
      // Mock the validate functions
      validateUserID.mockReturnValue(false); // Invalid user

      // Call the function
      await disableUserOrganization(req, res);

      // Check that the error response was called
      expect(sendError).toHaveBeenCalledWith(res, "User does not exist", 400);
    });

    //Test 3: Error if organization doesn't exist
    it('Should return an error if the organization does not exist', async () => {
        const req = {
          body: { userID: 123 },
          headers: { authorization: 'Bearer mockToken' }
        };
        const res = { sendSuccess, sendError };
    
        // Mock the JWT decode
        jwt.verify.mockReturnValue({ OrganizationID: 456 });
    
        // Mock the validate functions
        validateUserID.mockReturnValue(true);  // Valid user
        validateOrganizationID.mockReturnValue(false);  // Invalid organization
    
        // Call the function
        await disableUserOrganization(req, res);
    
        // Check that the error response was called
        expect(sendError).toHaveBeenCalledWith(res, "Organization does not exist", 400);
      });
    });

    //Test 4:: Error if disabiling fails
    it('Should return an error if disabling the user fails', async () => {
      const req = {
        body: { userID: 123 },
        headers: { authorization: 'Bearer mockToken' }
      };
      const res = { sendSuccess, sendError };

      // Mock the JWT decode
      jwt.verify.mockReturnValue({ OrganizationID: 456 });
      
      // Mock the validate functions
      validateUserID.mockReturnValue(true);
      validateOrganizationID.mockReturnValue(true);

      // Mock the actual disabling function
      mockDisableUserOrganization.mockResolvedValue(false); // Simulate failure

      // Call the function
      await disableUserOrganization(req, res);

      // Check that the error response was called
      expect(sendError).toHaveBeenCalledWith(res, "user removal failed", 404);
    });
  });

  //Test for disableUserNormalService
  describe('disableUserNormalService', () => {
    
    //Test 5: Disable user no successfully
    it('Should disable the user successfully', async () => {
      const req = {
        headers: { authorization: 'Bearer mockToken' }
      };
      const res = { sendSuccess, sendError };

      // Mock the JWT decode
      jwt.verify.mockReturnValue({ id: 123 });

      // Mock the validate function
      validateUserID.mockReturnValue(true);

      // Mock the actual disabling function
      mockDisableUserNormal.mockResolvedValue(true);

      // Call the function
      await disableUserNormalService(req, res);

      // Check that the success response was called
      expect(sendSuccess).toHaveBeenCalledWith(res, "user successfully removed", 200);
    });

    //Test 6: Error if user doesn't exist
    it('Should return an error if the user does not exist', async () => {
      const req = {
        headers: { authorization: 'Bearer mockToken' }
      };
      const res = { sendSuccess, sendError };

      // Mock the JWT decode
      jwt.verify.mockReturnValue({ id: 123 });

      // Mock the validate function
      validateUserID.mockReturnValue(false); // Invalid user

      // Call the function
      await disableUserNormalService(req, res);

      // Check that the error response was called
      expect(sendError).toHaveBeenCalledWith(res, "User does not exist", 400);
    });

    //Test 7: Error if disabling user fails
    it('should return an error if disabling the user fails', async () => {
      const req = {
        headers: { authorization: 'Bearer mockToken' }
      };
      const res = { sendSuccess, sendError };

      // Mock the JWT decode
      jwt.verify.mockReturnValue({ id: 123 });

      // Mock the validate function
      validateUserID.mockReturnValue(true);

      // Mock the actual disabling function
      mockDisableUserNormal.mockResolvedValue(false); // Simulate failure

      // Call the function
      await disableUserNormalService(req, res);

      // Check that the error response was called
      expect(sendError).toHaveBeenCalledWith(res, "user removal failed", 404);
    });
  });

