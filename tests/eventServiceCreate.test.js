const EventController = require("../controllers/eventController");
const { User, Invitation, Attendee, Event } = require('../models');
const { createEvent } = require('../services/eventService');  // Adjust the path as needed
const { sendError, sendSuccess } = require('../utils/responseHelpers');

// Mock sendError and sendSuccess
jest.mock('../utils/responseHelpers', () => ({
  sendError: jest.fn(),
  sendSuccess: jest.fn(),
}));



describe('createEvent Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Mock res object for each test
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Create a mock req object
    req = {
      body: {},
      user: { id: '1', OrganizationID: '2' },  // Mock user data (adjust as needed)
    };
  });

  afterEach(() => {
    jest.clearAllMocks();  // Clean up mocks after each test
  });

  it('should return error if required inputs are missing', async () => {
    req.body = {};  // Simulate missing required inputs

    await createEvent(req, res);  // Call the controller

    // Assert that sendError was called with status 400 and the correct message
    expect(sendError).toHaveBeenCalledWith(res, "missing required inputs");
  });

  it('should return error if name is missing', async () => {
    req.body = { startDate: '2025-01-01', endDate: '2025-01-02', typeID: 1 };

    await createEvent(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "missing required inputs");
  });

  it('should return error if startDate is missing', async () => {
    req.body = { name: 'Test Event', endDate: '2025-01-02', typeID: 1 };

    await createEvent(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "missing required inputs");
  });

  it('should return error if endDate is missing', async () => {
    req.body = { name: 'Test Event', startDate: '2025-01-01', typeID: 1 };

    await createEvent(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "missing required inputs");
  });

  it('should return error if typeID is missing', async () => {
    req.body = { name: 'Test Event', startDate: '2030-01-01', endDate: '2030-01-02' };

    await createEvent(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "missing required inputs");
  });

  

  
});
