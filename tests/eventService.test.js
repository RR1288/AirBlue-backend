//eventService.test.js

//Set up constants
const { getEventPlanners, getFinanceUsers } = require("../services/eventService");
const { sendSuccess, sendError } = require("../utils/responseHelpers");
const EventController = require("../controllers/eventController");

// Mocking external dependencies
jest.mock("../controllers/eventController", () => ({
  getFinanceUsers: jest.fn(),
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

  beforeEach(async () => {
    // Reset mocks before each test
    await jest.clearAllMocks();
  });

  

  //Tests for getEventPlanners function
  describe("getEventPlanners", () => {

    //Test 1: Return event planners when eventId is good
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

    //Test 2: Error if no eventId is there
    it("Should return error if eventId is not provided", async () => {
      const mockReq = { params: {} };
      const mockRes = {};

      await getEventPlanners(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "Event ID is required", 400);
    });

    //Test 3: Error if contorller thorws error
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

    //Test 4: Rerturn finance users when eventId is all good
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

    //Test 5: Error if eventId is not there
    it("Should return error if eventId is not provided", async () => {
      const mockReq = { params: {} };
      const mockRes = {};

      await getFinanceUsers(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "Event ID is required", 400);
    });

    //Test 6: Handle error if controller throws error
    it("should handle error when EventController throws an error", async () => {
      const mockReq = { params: { eventId: "1" } };
      const mockRes = {};

      EventController.getEventStaffByRole.mockRejectedValue(new Error("Some error"));

      await getFinanceUsers(mockReq, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, "Could not fetch finance users", 500);
    });
  });
});
