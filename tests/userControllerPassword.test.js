// userControllerPassword.test.js

//Constatns
const { User, UserLogin, sequelize } = require("../models");
const emailSender = require("../utils/emailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userController = require("../controllers/userController");

// Mocking the necessary models
jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
  },
  UserLogin: {
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

jest.mock("../utils/emailSender", () => ({
  sendPasswordResetEmail: jest.fn(),
}));

//Testing time
describe("User Controller Passwords", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  //Tests for updatePassword function
  describe("updatePassword", () => {

    //Test 1: Update password successfully
    it("Should update the user's password successfully", async () => {
      // Arrange
      const userID = 1;
      const newPassword = "newSecurePassword123";
      const mockUserLogin = {
        update: jest.fn().mockResolvedValue(true), // Mock successful update
      };
      
      UserLogin.findByPk.mockResolvedValue(mockUserLogin);

      // Act
      const result = await userController.updatePassword(userID, newPassword);

      // Assert
      expect(result).toBe(true);
      expect(UserLogin.findByPk).toHaveBeenCalledWith(userID);
      expect(mockUserLogin.update).toHaveBeenCalledWith({
        Password: newPassword,
        token: null,
        LastPasswordChange: expect.any(Number), // Ensure LastPasswordChange is updated
      });
    });

    //Test 2: Throw error if no user
    it("Should throw an error if the user is not found", async () => {
      // Arrange
      const userID = 1;
      const newPassword = "newSecurePassword123";
      
      UserLogin.findByPk.mockResolvedValue(null); // Simulate user not found

      // Act & Assert
      await expect(userController.updatePassword(userID, newPassword)).rejects.toThrow("failed to update password");
    });

    //Test 3: Throw error if update fails
    it("Should throw an error if the password update fails", async () => {
      // Arrange
      const userID = 1;
      const newPassword = "newSecurePassword123";
      const mockUserLogin = {
        update: jest.fn().mockRejectedValue(new Error("Update failed")), // Mock failed update
      };
      
      UserLogin.findByPk.mockResolvedValue(mockUserLogin);

      // Act & Assert
      await expect(userController.updatePassword(userID, newPassword)).rejects.toThrow("failed to update password");
    });
  });

  //Tests for sendUpdatePasswordEmail function
  describe("sendUpdatePasswordEmail", () => {

    //Test 5: Send password reset email
    it("Should send a password reset email successfully", async () => {
      // Arrange
      const email = "user@example.com";
      const mockUser = {
        dataValues: {
          UserID: 1,
        },
      };
      const mockLogin = {
        update: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      UserLogin.findByPk.mockResolvedValue(mockLogin);
      emailSender.sendPasswordResetEmail.mockResolvedValue(true); // Mock successful email send

      // Act
      const result = await userController.sendUpdatePasswordEmail(email);

      // Assert
      expect(result).toBe(true);
      expect(User.findOne).toHaveBeenCalledWith({ where: { Email: email } });
      expect(UserLogin.findByPk).toHaveBeenCalledWith(mockUser.dataValues.UserID);
      expect(mockLogin.update).toHaveBeenCalledWith();
      expect(emailSender.sendPasswordResetEmail).toHaveBeenCalledWith(
        email,
        expect.stringContaining("reset-password?token=")
      );
    });

    //Test 6: Error if no user
    it("Should throw an error if user is not found", async () => {
      // Arrange
      const email = "nonexistent@example.com";
      User.findOne.mockResolvedValue(null); // Simulate user not found

      // Act & Assert
      await expect(userController.sendUpdatePasswordEmail(email)).rejects.toThrow("failed to send email");
    });

    
  });
});
