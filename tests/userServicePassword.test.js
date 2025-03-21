//userServicePassword.test.js

//Constants
const { updatePasswordAdmin, resetPassword } = require('../services/userService');
const { sendError, sendSuccess } = require('../utils/responseHelpers');
const { updatePassword } = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const { sanitizePassword, validateUserID } = require('../utils/UserSanitizations');

//Mock time
jest.mock('../utils/responseHelpers', () => ({
  sendError: jest.fn(),
  sendSuccess: jest.fn(),
}));

jest.mock('../controllers/userController', () => ({
  updatePassword: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../utils/UserSanitizations', () => ({
  sanitizePassword: jest.fn(),
  validateUserID: jest.fn(),
}));

//Tests for updatePasswordAdmin
describe('updatePasswordAdmin', () => {

    //Test 1: Error if user isn't there
    it('Should return an error if user does not exist', async () => {
        // Mock the user validation to return false (indicating user does not exist)
        validateUserID.mockReturnValue(false);
    
        const req = {
          body: { userID: 1, password: 'newPassword' },
          headers: { authorization: 'Bearer token' },
        };
        const res = {};
        const sendErrorMock = jest.fn();
        sendError.mockImplementation(sendErrorMock);
    
        await updatePasswordAdmin(req, res);
    
        expect(sendErrorMock).toHaveBeenCalledWith(res, 'User does not exist', 400);
    });

    //Test 2: Update password successfully and send success
    it('Should update password successfully and send a success response', async () => {
        // Mock the user validation to return true (indicating user exists)
        validateUserID.mockReturnValue(true);
        sanitizePassword.mockReturnValue('newValidPassword');
        jwt.verify.mockReturnValue({ id: 1 });
        updatePassword.mockResolvedValue(true);
    
        const req = {
          body: { userID: 1, password: 'newPassword' },
          headers: { authorization: 'Bearer token' },
        };
        const res = {};
        const sendSuccessMock = jest.fn();
        sendSuccess.mockImplementation(sendSuccessMock);
    
        await updatePasswordAdmin(req, res);
    
        expect(sendSuccessMock).toHaveBeenCalledWith(res, 'successfully sent password reset to user');
    });
    
    //Test 3: Error if password invalid
    it('Should return an error if password is invalid', async () => {
        sanitizePassword.mockReturnValue(null);
    
        const req = {
          body: { userID: 1, password: '' },
          headers: { authorization: 'Bearer token' },
        };
        const res = {};
        const sendErrorMock = jest.fn();
        sendError.mockImplementation(sendErrorMock);
    
        await updatePasswordAdmin(req, res);
    
        expect(sendErrorMock).toHaveBeenCalledWith(res, 'invalid password', 400);
    });
});

//Tests for resetPassword function
describe('resetPassword', () => {

  //Test 4: Error if password invalid
  it('Should return an error if password is invalid', async () => {
    sanitizePassword.mockReturnValue(null);

    const req = {
      body: { password: '' },
      headers: { authorization: 'Bearer token' },
    };
    const res = {};
    const sendErrorMock = jest.fn();
    sendError.mockImplementation(sendErrorMock);

    await resetPassword(req, res);

    expect(sendErrorMock).toHaveBeenCalledWith(res, 'invalid password', 400);
  });

  //Test 5: Reset password and send success
  it('Should reset password successfully and send a success response', async () => {
    sanitizePassword.mockReturnValue('newValidPassword');
    jwt.verify.mockReturnValue({ id: 1 });
    updatePassword.mockResolvedValue(true);

    const req = {
      body: { password: 'newPassword' },
      headers: { authorization: 'Bearer token' },
    };
    const res = {};
    const sendSuccessMock = jest.fn();
    sendSuccess.mockImplementation(sendSuccessMock);

    await resetPassword(req, res);

    expect(sendSuccessMock).toHaveBeenCalledWith(res, 'successfully reset password');
  });

  //Test 6: Error if update fails
  it('Should return an error if updatePassword fails', async () => {
    sanitizePassword.mockReturnValue('newValidPassword');
    jwt.verify.mockReturnValue({ id: 1 });
    updatePassword.mockResolvedValue(false);

    const req = {
      body: { password: 'newPassword' },
      headers: { authorization: 'Bearer token' },
    };
    const res = {};
    const sendErrorMock = jest.fn();
    sendError.mockImplementation(sendErrorMock);

    await resetPassword(req, res);

    expect(sendErrorMock).toHaveBeenCalledWith(res, 'failed to reset password', 400);
  });
});
