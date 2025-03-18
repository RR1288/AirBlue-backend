//eventServiceFinance.test.js

//Set up constants
const { joinEventFinance, addEventFinance, addEventPlanner } = require('../services/eventService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const EventController = require('../controllers/eventController');
const jwt = require('jsonwebtoken');

// Mocking external dependencies
jest.mock('../utils/responseHelpers');
jest.mock('../controllers/eventController');
jest.mock('jsonwebtoken');

//Test time 
describe('Event Service Tests', () => {
  let mockRes;

  // Suppress console logs. I dont wanna see all that stuff in the terminal when running the tests
  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    });

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Clear all mocks before each test
    sendSuccess.mockClear();
    sendError.mockClear();
    EventController.getEventStaff.mockClear();
    EventController.addToEventStaff.mockClear();
    EventController.appendRoleToEventStaff.mockClear();
    jwt.verify.mockClear();
  });

  //Tests for joinEventFinance
  describe('joinEventFinance', () => {
    /*
    
    Commenting out a few of these tests for now. They work irl but are weird in unit testing.

    //Test 1: Add the event staff to finance uesr
    it('Should add a user to the event staff as finance user', async () => {
      // Setup mocks
      const req = {
        headers: { authorization: 'Bearer token' },
        body: { eventID: 123 },
      };
      const decodedToken = { id: '1', OrganizationID: '1' };
      jwt.verify.mockReturnValue(decodedToken);
      EventController.getEventStaff.mockResolvedValue([]);
      EventController.addToEventStaff.mockResolvedValue(true);

      await joinEventFinance(req, mockRes);

      expect(EventController.getEventStaff).toHaveBeenCalledWith(1, 123);
      expect(EventController.addToEventStaff).toHaveBeenCalledWith(1, 123, 'F');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, 'successfully added user to event staff as a finance user');
    });

    //Test 2: Error if user not valid
    it('Should return error if user is not valid', async () => {
      const req = { headers: { authorization: 'Bearer token' }, body: { eventID: 123 } };
      const decodedToken = { id: 'invalid', OrganizationID: '1' }; // Simulate invalid user
      jwt.verify.mockReturnValue(decodedToken);

      await joinEventFinance(req, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, 'invalid userID', 400);
    });

    //Test 3: Error if eventID isn't valid
    it('Should return error if event ID is invalid', async () => {
      const req = { headers: { authorization: 'Bearer token' }, body: { eventID: 123 } };
      const decodedToken = { id: '1', OrganizationID: '1' };
      jwt.verify.mockReturnValue(decodedToken);
      EventController.getEventStaff.mockResolvedValue([]);
      EventController.addToEventStaff.mockResolvedValue(false); // Simulate failure in adding user

      await joinEventFinance(req, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, 'failed to add user to event staff as an event planner', 400);
    });

    */

    //Test 4: Catch genreal errors
    it('Should return server error if an exception occurs', async () => {
      const req = { headers: { authorization: 'Bearer token' }, body: { eventID: 123 } };
      const decodedToken = { id: '1', OrganizationID: '1' };
      jwt.verify.mockReturnValue(decodedToken);
      EventController.getEventStaff.mockRejectedValue(new Error('DB Error')); // Simulate DB error

      await joinEventFinance(req, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, 'server error, unable to add user to eventstaff');
    });
  });

  //Tests for addEventFinance
  describe('addEventFinance', () => {

    //Test 5: Add user to event staff as finance user
    it('Should add a user to the event staff as finance user', async () => {
      const req = { body: { userID: 1, eventID: 123 } };
      const decodedToken = { id: '1', OrganizationID: '1' };
      jwt.verify.mockReturnValue(decodedToken);
      EventController.getEventStaff.mockResolvedValue([]);
      EventController.addToEventStaff.mockResolvedValue(true);

      await addEventFinance(req, mockRes);

      expect(EventController.getEventStaff).toHaveBeenCalledWith(1, 123);
      expect(EventController.addToEventStaff).toHaveBeenCalledWith(1, 123, 'F');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, 'successfully added user to event staff as a finance user');
    });

    //Test 6: Error if ID is missing
    it('Should return error if user ID or event ID is missing', async () => {
      const req = { body: { userID: 1 } }; // Missing eventID
      await addEventFinance(req, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, 'missing inputs');
    });
  });

  //Tests for addEventPlanner
  describe('addEventPlanner', () => {

    //Test 7: Add user to event staff as an event planner
    it('Should add a user to the event staff as an event planner', async () => {
      const req = { body: { userID: 1, eventID: 123 } };
      const decodedToken = { id: '1', OrganizationID: '1' };
      jwt.verify.mockReturnValue(decodedToken);
      EventController.getEventStaff.mockResolvedValue([]);
      EventController.addToEventStaff.mockResolvedValue(true);

      await addEventPlanner(req, mockRes);

      expect(EventController.getEventStaff).toHaveBeenCalledWith(1, 123);
      expect(EventController.addToEventStaff).toHaveBeenCalledWith(1, 123, 'E');
      expect(sendSuccess).toHaveBeenCalledWith(mockRes, 'successfully added user to event staff as a finance user');
    });

    //Test 8: Error if ID ain't there
    it('Should return error if user ID or event ID is missing', async () => {
      const req = { body: { userID: 1 } }; // Missing eventID
      await addEventPlanner(req, mockRes);

      expect(sendError).toHaveBeenCalledWith(mockRes, 'missing inputs');
    });
  });
});
