//emailSender.test.js

//Set up constants
const nodemailer = require('nodemailer');

// Mock nodemailer module
jest.mock('nodemailer');

//Describe the emailing
describe('Email Sender', () => {
  let sendMailMock;

  beforeAll(() => {
    // Mock the createTransport method to return an object with a mock sendMail method
    sendMailMock = jest.fn();
    // Ensure createTransport returns an object with the sendMail method
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  beforeEach(() => {
    sendMailMock.mockClear(); // Clear previous calls before each test
  });

  //First Test: Make sure the password reset email is sending
  test('sendPasswordResetEmail should call sendMail', async () => {
    const { sendPasswordResetEmail } = require('../utils/emailSender'); // Import here to use the mock
    const userEmail = 'test@example.com';

    // Call the function you want to test
    await sendPasswordResetEmail(userEmail);

    // Check if sendMail was called
    expect(sendMailMock).toHaveBeenCalled();
  });

  //Second Test: Make sure the account setup email is sending
  test('sendAccountSetupEmail should call sendMail', async () => {
    const { sendAccountSetupEmail } = require('../utils/emailSender'); // Import here to use the mock
    const userEmail = 'test@example.com';

    // Call the function you want to test
    await sendAccountSetupEmail(userEmail);

    // Check if sendMail was called
    expect(sendMailMock).toHaveBeenCalled();
  });
});
