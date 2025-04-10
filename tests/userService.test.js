//userService.test.js

//Set up constants
const {
  registerUserEndUser,
  registerUserCSV,
  registerUserOrganization,
} = require("../services/userService");

const { sendError, sendSuccess } = require("../utils/responseHelpers");
const { registerUserFull, registerBasic, setOrganization } = require("../controllers/userController");
const { sanitizeEmail, sanitizeName, sanitizeCountry, sanitizePassword, sanitizeCity, sanitizeState } = require("../utils/UserSanitizations");
const { sanitizeRoles } = require("../utils/UserOrganizationSanitizations");
const { validateOrganizationID } = require("../utils/OrganizationSanitization");

// Mocking the imported functions
jest.mock("../utils/responseHelpers", () => ({
  sendError: jest.fn(),
  sendSuccess: jest.fn(),
}));

jest.mock("../controllers/userController", () => ({
  registerUserFull: jest.fn(),
  registerBasic: jest.fn(),
  setOrganization: jest.fn(),
}));

jest.mock("../utils/UserSanitizations", () => ({
  sanitizeEmail: jest.fn(),
  sanitizeName: jest.fn(),
  sanitizeCountry: jest.fn(),
  sanitizePassword: jest.fn(),
  sanitizeCity: jest.fn(),
  sanitizeState: jest.fn(),
}));

jest.mock("../utils/UserOrganizationSanitizations", () => ({
  sanitizeRoles: jest.fn(),
}));

jest.mock("../utils/OrganizationSanitization", () => ({
  validateOrganizationID: jest.fn(), // Ensure it's a function mock
}));


//Test for User Service
describe("User Service", () => {

  beforeEach(async () => {
    await jest.clearAllMocks();
  });

  //Tests for registerUserEndUser Function

  //Test 1: Error if required fields are missing
  describe("registerUserEndUser", () => {
    it("Should return an error if required fields are missing", async () => {
      const req = {
        body: {
          fname: "John",
          lname: "Doe",
          country: "US",
          email: "john.doe@example.com"
        }
      };
      const res = {};
      
      // Simulate a missing password
      await registerUserEndUser(req, res);

      expect(sendError).toHaveBeenCalledWith(res, "Arguments missing", 401);
    });

    //Test 2: Error if sanitization fails
    it("Should return an error if sanitization fails", async () => {
      const req = {
        body: {
          password: "password123",
          fname: "John",
          lname: "Doe",
          city: "New York",
          state: "NY",
          country: "US",
          email: "invalidemail"
        }
      };
      const res = {};

      sanitizeEmail.mockReturnValue(null);

      await registerUserEndUser(req, res);

      expect(sendError).toHaveBeenCalledWith(res, "Invalid input for email", 400);
    });

    //Test 3: Successfully register a user
    it("Should successfully register a user", async () => {
      const req = {
        body: {
          password: "password123",
          fname: "John",
          lname: "Doe",
          city: "New York",
          state: "NY",
          country: "US",
          email: "john.doe@example.com"
        }
      };
      const res = {};
      
      // Mock successful sanitization and registration
      sanitizeEmail.mockReturnValue("john.doe@example.com");
      sanitizeName.mockReturnValue("John");
      sanitizeCountry.mockReturnValue("US");
      sanitizePassword.mockReturnValue("password123");
      registerUserFull.mockResolvedValue({ userId: 1 });

      await registerUserEndUser(req, res);

      expect(sendSuccess).toHaveBeenCalledWith(res, "User registered successfully");
    });

    //Test 4: Error if registration fails
    it("Should return an error if registration fails", async () => {
      const req = {
        body: {
          password: "password123",
          fname: "John",
          lname: "Doe",
          city: "New York",
          state: "NY",
          country: "US",
          email: "john.doe@example.com"
        }
      };
      const res = {};
      
      // Mock failed registration
      sanitizeEmail.mockReturnValue("john.doe@example.com");
      sanitizeName.mockReturnValue("John");
      sanitizeCountry.mockReturnValue("US");
      sanitizePassword.mockReturnValue("password123");
      registerUserFull.mockResolvedValue(null);

      await registerUserEndUser(req, res);

      expect(sendError).toHaveBeenCalledWith(res, "Could not register this user", 404);
    });
  });

  //Tests for registerUserCSV Function
  describe("registerUserCSV", () => {

    //Test 5: Error if required fields are missing
    it("Should return an error if required fields are missing", async () => {
      const req = {
        body: {
          fname: "John",
          lname: "",
          country: "US",
          email: "john.doe@example.com"
        }
      };
      const res = {};
      
      // Simulate missing fields
      await registerUserCSV(req, res);

      expect(sendError).toHaveBeenCalledWith(res, "Arguments missing", 401);
    });

    //Test 6: Error if sanitization fails
    it("Should return an error if sanitization fails", async () => {
      const req = {
        body: {
          fname: "John",
          lname: "Doe",
          country: "US",
          email: "dirtyemail.com"
        }
      };
      const res = {};

      sanitizeEmail.mockReturnValue(null);

      await registerUserCSV(req, res);

      expect(sendError).toHaveBeenCalledWith(res, "Invalid input for email", 400);
    });

    //Test 7: Error if registration fails
    it("Should return an error if registration fails", async () => {
      const req = {
        body: {
          fname: "John",
          lname: "Doe",
          country: "US",
          email: "john.doe@example.com"
        }
      };
      const res = {};

      sanitizeEmail.mockReturnValue("john.doe@example.com");
      sanitizeName.mockReturnValue("John");
      sanitizeCountry.mockReturnValue("US");
      registerBasic.mockResolvedValue("john.doe@example.com");

      await registerUserCSV(req, res);

      expect(sendError).toHaveBeenCalledWith(res, "Could not register this user", 404);
    });
  });

  //Tests for registerUserOrganization Funciton
  describe("registerUserOrganization", () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        body: {
          fname: "John",
          lname: "Doe",
          password: "password123",
          city: "New York",
          country: "USA",
          state: "NY",
          email: "john.doe@example.com",
          roles: ["admin"],
        },
        user: {
          OrganizationID: "1",
        },
        headers: {
          authorization: "Bearer valid-token",
        },
      };
      res = {
        json: jest.fn(),
      };
      jest.clearAllMocks();
    });
  
    //Test 8: Error if registration fails
    it("Should return an error if user registration fails", async () => {
      sanitizeEmail.mockReturnValue("john.doe@example.com");
      sanitizeName.mockReturnValue("John");
      sanitizeCountry.mockReturnValue("USA");
      sanitizeState.mockReturnValue("NY");
      sanitizeCity.mockReturnValue("New York");
      sanitizePassword.mockReturnValue("password123");
      sanitizeRoles.mockReturnValue(["admin"]);
      validateOrganizationID.mockReturnValue(true);
      registerUserFull.mockResolvedValue(null);
      sendError.mockImplementation((res, msg, status) => {
        res.json({ message: msg, status });
      });
  
      await registerUserOrganization(req, res);
  
      expect(sendError).toHaveBeenCalledWith(
        res,
        "Could not register this user",
        404
      );
    });
  
    //Test 9: Error if org is invalid
    it("Should return an error if organization validation fails", async () => {
      sanitizeEmail.mockReturnValue("john.doe@example.com");
      sanitizeName.mockReturnValue("John");
      sanitizeCountry.mockReturnValue("USA");
      sanitizeState.mockReturnValue("NY");
      sanitizeCity.mockReturnValue("New York");
      sanitizePassword.mockReturnValue("password123");
      sanitizeRoles.mockReturnValue(["admin"]);
      validateOrganizationID.mockReturnValue(false);
      sendError.mockImplementation((res, msg, status) => {
        res.json({ message: msg, status });
      });
  
      await registerUserOrganization(req, res);
  
      expect(sendError).toHaveBeenCalledWith(res, "Invalid input for organization", 400);
    });
  
    //Test 10: Error if fields missing
    it("Should return an error if required fields are missing", async () => {
      const incompleteReq = { ...req, body: { ...req.body, fname: undefined } };
  
      await registerUserOrganization(incompleteReq, res);
  
      expect(sendError).toHaveBeenCalledWith(res, "Arguments missing", 401);
    });
  
    //Test 11: Error if email sanitization fails
    it("Should return an error if email sanitization fails", async () => {
      sanitizeEmail.mockReturnValue(null);
      sendError.mockImplementation((res, msg, status) => {
        res.json({ message: msg, status });
      });
  
      await registerUserOrganization(req, res);
  
      expect(sendError).toHaveBeenCalledWith(res, "Invalid input for email", 400);
    });
  });

});
