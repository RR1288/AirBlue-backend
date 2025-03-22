//flightServiceCancel.test.js

//Set up constants
const flightService = require("../services/flightService"); // Adjust path accordingly
const { sendSuccess, sendError } = require("../utils/responseHelpers");
const flightController = require("../controllers/flightController");

// Mocking 
jest.mock("../controllers/flightController");
jest.mock("../utils/responseHelpers");


//Testing time
describe("Flight Service", () => {

    // Suppress console logs. I dont wanna see all that stuff in the terminal when running the tests
  beforeAll(() => {
        console.log = jest.fn();
        console.error = jest.fn();
  });

  afterEach(async () => {
    await jest.clearAllMocks(); // Clear mocks after each test
  });

  //Tests for declinePendingFlight function
  describe("declinePendingFlight", () => {

    //Test 1: Success when flight is declined
    it("Should return success when flight is declined", async () => {
      // Arrange: Mock the controller and response helpers
      const mockItinerary = { id: "1", ApprovalStatus: "denied" };
      flightController.declinePendingFlight.mockResolvedValue(mockItinerary);
      sendSuccess.mockImplementation((res, message, data) => {
        res.status = 200;
        res.message = message;
        res.data = data;
      });

      const req = { params: { itinerary_id: "1" } };
      const res = {};

      // Act: Call the service function
      await flightService.declinePendingFlight(req, res);

      // Assert: Check that sendSuccess was called with the correct response
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        "Declined pending flight successfully",
        { updatedItinerary: mockItinerary }
      );
    });

    //Test 2: Error when decline fails
    it("Should return error when decline fails", async () => {
      // Arrange: Simulate a failure in the declinePendingFlight method
      flightController.declinePendingFlight.mockResolvedValue(null);
      sendError.mockImplementation((res, message, code) => {
        res.status = code;
        res.message = message;
      });

      const req = { params: { itinerary_id: "1" } };
      const res = {};

      // Act: Call the service function
      await flightService.declinePendingFlight(req, res);

      // Assert: Check that sendError was called when the decline fails
      expect(sendError).toHaveBeenCalledWith(
        res,
        "Couldn't decline the flight",
        400
      );
    });

    //Test 3: Error when exception
    it("Should return error when exception occurs", async () => {
      // Arrange: Simulate an exception being thrown
      flightController.declinePendingFlight.mockRejectedValue(new Error("Something went wrong"));
      sendError.mockImplementation((res, message, code) => {
        res.status = code;
        res.message = message;
      });

      const req = { params: { itinerary_id: "1" } };
      const res = {};

      // Act: Call the service function
      await flightService.declinePendingFlight(req, res);

      // Assert: Check that sendError was called with the correct error message
      expect(sendError).toHaveBeenCalledWith(
        res,
        "Couldn't decline the flight",
        400
      );
    });
  });

  //Tests for cancelApprovedFlight function
  describe("cancelApprovedFlight", () => {

    //Test 4: Success when flight is canceled
    it("Should return success when flight is canceled", async () => {
      // Arrange: Mock the controller and response helpers
      const mockItinerary = { id: "1", ApprovalStatus: "denied" };
      flightController.cancelApprovedFlight.mockResolvedValue(mockItinerary);
      sendSuccess.mockImplementation((res, message, data) => {
        res.status = 200;
        res.message = message;
        res.data = data;
      });

      const req = { params: { itinerary_id: "1" } };
      const res = {};

      // Act: Call the service function
      await flightService.cancelApprovedFlight(req, res);

      // Assert: Check that sendSuccess was called with the correct response
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        "Cancelled approved flight successfully",
        { updatedItinerary: mockItinerary }
      );
    });


    //Test 5: Error when cancel fails
    it("Should return error when cancel fails", async () => {
      // Arrange: Simulate a failure in the cancelApprovedFlight method
      flightController.cancelApprovedFlight.mockResolvedValue(null);
      sendError.mockImplementation((res, message, code) => {
        res.status = code;
        res.message = message;
      });

      const req = { params: { itinerary_id: "1" } };
      const res = {};

      // Act: Call the service function
      await flightService.cancelApprovedFlight(req, res);

      // Assert: Check that sendError was called when the cancel fails
      expect(sendError).toHaveBeenCalledWith(
        res,
        "Couldn't cancel the flight",
        400
      );
    });

    //Test 6: Error when exception
    it("Should return error when exception occurs", async () => {
      // Arrange: Simulate an exception being thrown
      flightController.cancelApprovedFlight.mockRejectedValue(new Error("Something went wrong"));
      sendError.mockImplementation((res, message, code) => {
        res.status = code;
        res.message = message;
      });

      const req = { params: { itinerary_id: "1" } };
      const res = {};

      // Act: Call the service function
      await flightService.cancelApprovedFlight(req, res);

      // Assert: Check that sendError was called with the correct error message
      expect(sendError).toHaveBeenCalledWith(
        res,
        "Couldn't cancel the flight",
        400
      );
    });
  });
});
