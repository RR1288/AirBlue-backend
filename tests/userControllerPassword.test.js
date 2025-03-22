//userControllerPassword.test.js
const { updatePassword, sendUpdatePasswordEmail } = require("../controllers/userController");
const { User, UserLogin } = require("../models");
const emailSender = require("../utils/emailSender");
const bcrypt = require("bcryptjs");

//Mock time
jest.mock("../models"); // Mock models
jest.mock("../utils/emailSender"); // Mock email sender

beforeAll(() => {
    // Mocks console outputs cause I dont wana see all that
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterAll(() => {
    // Restores console.log and console.error after all tests
    console.log.mockRestore();
    console.error.mockRestore();
  });

//Testing time
describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //Tests for updatePassword
  describe("updatePassword", () => {

    //Test 1: Update user's password
    it("Should successfully update the user's password", async () => {
      const userID = 1, newPassword = "newPassword123", hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Mock UserLogin.findByPk to return a mock user login object
      const mockUserLogin = {
        UserID: userID,
        update: jest.fn().mockResolvedValue(true), // Simulate successful update
      };
      UserLogin.findByPk.mockResolvedValue(mockUserLogin);

      const result = await updatePassword(userID, hashedPassword);

      // Ensure the mock update method was called with correct values
      expect(mockUserLogin.update).toHaveBeenCalledWith({
        Password: hashedPassword,
        token: null,
        LastPasswordChange: expect.any(Number),
      });

      expect(result).toBe(true); // Expect the function to return true on success
    });

    //Test 2: Error if user loginn not found
    it("Should throw an error if user login is not found", async () => {
      const userID = 1, newPassword = "newPassword123";
      
      // Mock UserLogin.findByPk to return null (user not found)
      UserLogin.findByPk.mockResolvedValue(null);

      await expect(updatePassword(userID, newPassword)).rejects.toThrow(
        "failed to update password"
      );
    });
  });

  //Tests for sendUpdatePasswordEmail
  describe("sendUpdatePasswordEmail", () => {

    //Test 3: Send password reset email with good token
    it("Should send a password reset email with a valid token", async () => {
      const email = "user@example.com";
      const mockUser = {
        dataValues: {
          UserID: 1,
        },
      };

      const mockUserLogin = {
        UserID: 1,
        token: null,
        update: jest.fn().mockResolvedValue(true), // Simulate successful token update
      };

      // Mock the database calls
      User.findOne.mockResolvedValue(mockUser);
      UserLogin.findByPk.mockResolvedValue(mockUserLogin);
      emailSender.sendPasswordResetEmail.mockResolvedValue(true); // Simulate email sent successfully

      const result = await sendUpdatePasswordEmail(email);

      // Check that the token was set and update method was called
      expect(mockUserLogin.update).toHaveBeenCalledWith();
      expect(mockUserLogin.token).toBeDefined(); // Ensure token was set

      // Ensure the email sending function was called
      await expect(emailSender.sendPasswordResetEmail).toHaveBeenCalledWith(
        email,
        expect.stringContaining("reset-password?token=")
      );

      expect(result).toBe(true);
    });

    //Test 4: Error if user is not found
    it("Should throw an error if the user is not found", async () => {
      const email = "user@example.com";

      // Mock the User.findOne to return null (user not found)
      User.findOne.mockResolvedValue(null);

      await expect(sendUpdatePasswordEmail(email)).rejects.toThrow(
        "failed to send email"
      );
    });

    //Test 5: Handle general failure
    it("Should handle email sending failure", async () => {
      const email = "user@example.com";
      const mockUser = {
        dataValues: {
          UserID: 1,
        },
      };

      const mockUserLogin = {
        UserID: 1,
        token: null,
        update: jest.fn().mockResolvedValue(true),
      };

      // Mock the database calls
      User.findOne.mockResolvedValue(mockUser);
      UserLogin.findByPk.mockResolvedValue(mockUserLogin);
      emailSender.sendPasswordResetEmail.mockRejectedValue(new Error("Email send failed"));

      await expect(sendUpdatePasswordEmail(email)).rejects.toThrow("failed to send email");
    });
  });
});
