//eventService.test.js

//Set up constants
const { getAttendees, getEventPlanners, getFinanceUsers } = require("../services/eventService");
const { sendSuccess, sendError } = require("../utils/responseHelpers");
const EventController = require("../controllers/eventController");

// Mocking external dependencies
jest.mock("../controllers/eventController", () => ({
  getAttendees: jest.fn(),
  getEventStaffByRole: jest.fn(),
}));

jest.mock("../utils/responseHelpers", () => ({
  sendSuccess: jest.fn(),
  sendError: jest.fn(),
}));

//Testing time for eventService
describe("eventService", () => {

    // Suppress console logs. I dont wanna see all that stuff in the terminal when running the tests
  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  //Tests for getAttendees function
  describe("getAttendees", () => {

    //Test 1: Return attendees wehn there is a valid eventId
    it("Should return attendees when eventId is valid", async () => {
      const mockReq = { params: { eventId: "1" } };
      const mockRes = {};
      const mockAttendees = [
        { User: { UserID: 1, FName: "John", LName: "Doe", Email: "john.doe@example.com" } },
      ];

      EventController.getAttendees.mockResolvedValue(mockAttendees);

      await getAttendees(mockReq, mockRes);

      expect(EventController.getAttendees).toHaveBeenCalledWith("1");
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, mockAttendees, "Attendees fetched successfully");
    });

    //Test 2: Error if no eventId is given
    it("Should return error if eventId is not provided", async () => {
      const mockReq = { params: {} };
      const mockRes = {};

      await getAttendees(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "Event ID is required", 400);
    });

    //Test 4:  Error if controller throws error
    it("Should handle error when EventController throws an error", async () => {
      const mockReq = { params: { eventId: "1" } };
      const mockRes = {};

      EventController.getAttendees.mockRejectedValue(new Error("Some error"));

      await getAttendees(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "Some error", 500);
    });
  });

  //Tests for getEventPlanners function
  describe("getEventPlanners", () => {

    //Test 5: Return event planners when eventId is good
    it("Should return event planners when eventId is valid", async () => {
      const mockReq = { params: { eventId: "1" } };
      const mockRes = {};
      const mockPlanners = [
        { User: { UserID: 1, FName: "Jane", LName: "Doe", Email: "jane.doe@example.com" } },
      ];

      EventController.getEventStaffByRole.mockResolvedValue(mockPlanners);

      await getEventPlanners(mockReq, mockRes);

      expect(EventController.getEventStaffByRole).toHaveBeenCalledWith("1", "E");
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, "Event planners fetched successfully", { planners: mockPlanners });
    });

    //Test 6: Error if no eventId is there
    it("Should return error if eventId is not provided", async () => {
      const mockReq = { params: {} };
      const mockRes = {};

      await getEventPlanners(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "Event ID is required", 400);
    });

    //Test 7: Error if contorller thorws error
    it("Should handle error when EventController throws an error", async () => {
      const mockReq = { params: { eventId: "1" } };
      const mockRes = {};

      EventController.getEventStaffByRole.mockRejectedValue(new Error("Some error"));

      await getEventPlanners(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "Could not fetch event planners", 500);
    });
  });

  //Tests for getFinanceUsers
  describe("getFinanceUsers", () => {

    //Test 8: Rerturn finance users when eventId is all good
    it("Should return finance users when eventId is valid", async () => {
      const mockReq = { params: { eventId: "1" } };
      const mockRes = {};
      const mockFinanceUsers = [
        { User: { UserID: 1, FName: "Mike", LName: "Smith", Email: "mike.smith@example.com" } },
      ];

      EventController.getEventStaffByRole.mockResolvedValue(mockFinanceUsers);

      await getFinanceUsers(mockReq, mockRes);

      expect(EventController.getEventStaffByRole).toHaveBeenCalledWith("1", "F");
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, "Finance users fetched successfully", { financeUsers: mockFinanceUsers });
    });

    //Test 9: Error if eventId is not there
    it("Should return error if eventId is not provided", async () => {
      const mockReq = { params: {} };
      const mockRes = {};

      await getFinanceUsers(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "Event ID is required", 400);
    });

    //Test 10: Handle error if controller throws error
    it("should handle error when EventController throws an error", async () => {
      const mockReq = { params: { eventId: "1" } };
      const mockRes = {};

      EventController.getEventStaffByRole.mockRejectedValue(new Error("Some error"));

      await getFinanceUsers(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "Could not fetch finance users", 500);
    });
  });
});
