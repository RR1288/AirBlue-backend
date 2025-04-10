//attendeeServiceToken.test.js

//Constants
const { updateTokenOnCreation } = require("../services/attendeeService");
const { sendSuccess, sendError } = require("../utils/responseHelpers");
const { validateToken } = require("../utils/invitationValidation");
const AttendeeController = require("../controllers/attendeeController");

// Mocks
jest.mock("../utils/responseHelpers");
jest.mock("../utils/invitationValidation");
jest.mock("../controllers/attendeeController");

//Testing time for updateTokenOnCreation function
describe("updateTokenOnCreation", () => {
  let req, res;

  beforeEach(() => {

    req = {
      body: {
        token: "valid-token"
      },
    };
    res = {
      sendSuccess,
      sendError
    };
  });

  //Test 1: Successfully update token when given a token
  it("Should successfully update the token when given a valid token", async () => {

    validateToken.mockReturnValue(true);

    AttendeeController.updateTokenOnUserCreation.mockReturnValue(true);

    await updateTokenOnCreation(req, res);

    expect(sendSuccess).toHaveBeenCalledWith(res, "successfully updated invitation");
  });

  //Test 2: Return error when token is inavlid
  it("Should return an error when the token is invalid", async () => {
   
    validateToken.mockReturnValue(false);

    await updateTokenOnCreation(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "invalid token", 400);
  });

  //Test 3: Error when function fials
  it("Should return an error when updateTokenOnUserCreation fails", async () => {

    validateToken.mockReturnValue(true);

    AttendeeController.updateTokenOnUserCreation.mockReturnValue(false);

    await updateTokenOnCreation(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "unable to updated invitation", 400);
  });

  //Test 4: Handle general errors
  it("Should handle unexpected errors gracefully", async () => {

    validateToken.mockReturnValue(true);

    AttendeeController.updateTokenOnUserCreation.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    await updateTokenOnCreation(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "failed to update invitation");
  });
});
