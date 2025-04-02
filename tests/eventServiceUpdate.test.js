//eventServiceUpdate.test.js

//Setup Constatns
const { updateEvent } = require('../services/eventService');
const EventController = require('../controllers/eventController');
const { sendError, sendSuccess } = require('../utils/responseHelpers');
const { sanitizeEventName, sanitizeDate, sanitizeLocation, sanitizeEventDescription } = require('../utils/eventSanitization');

// Mock
jest.mock('../controllers/eventController', () => ({
  updateEvent: jest.fn(),
  getEventStaff: jest.fn(),
  addToEventStaff: jest.fn(),
  appendRoleToEventStaff: jest.fn(),
  createEventGroup: jest.fn(),
  getEventStaffByRole: jest.fn(),
  processInvitationAcceptance: jest.fn(),
}));

jest.mock('../utils/responseHelpers', () => ({
  sendError: jest.fn(),
  sendSuccess: jest.fn(),
}));

jest.mock('../utils/eventSanitization', () => ({
  sanitizeEventName: jest.fn(),
  sanitizeDate: jest.fn(),
  sanitizeLocation: jest.fn(),
  sanitizeEventDescription: jest.fn(),
}));

//Testing time for updateEvent function
describe('updateEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        eventID: 1,
        EventName: 'Updated Event',
        startDate: '2025-05-01',
        description: 'Updated Description',
        location: 'Updated Location',
        maxAttendees: 100,
      },
      headers: {
        authorization: 'Bearer validToken',
      },
    };

    res = {
      json: jest.fn(),
    };

    // Reset mocks before each test
    sendError.mockReset();
    sendSuccess.mockReset();
    EventController.updateEvent.mockReset();
    sanitizeEventName.mockReset();
    sanitizeDate.mockReset();
    sanitizeLocation.mockReset();
    sanitizeEventDescription.mockReset();
  });

  //Test 1: Update event successfully
  it('Should update event successfully', async () => {
    
    sanitizeEventName.mockReturnValue('Updated Event');
    sanitizeDate.mockReturnValue('2025-05-01');
    sanitizeLocation.mockReturnValue('Updated Location');
    sanitizeEventDescription.mockReturnValue('Updated Description');
    EventController.updateEvent.mockResolvedValue({ eventID: 1, ...req.body });

    await updateEvent(req, res);

    expect(sanitizeEventName).toHaveBeenCalledWith('Updated Event');
    expect(sanitizeDate).toHaveBeenCalledWith('2025-05-01');
    expect(sanitizeLocation).toHaveBeenCalledWith('Updated Location');
    expect(sanitizeEventDescription).toHaveBeenCalledWith('Updated Description');
    expect(EventController.updateEvent).toHaveBeenCalledWith(1, {
      EventName: 'Updated Event',
      EventStartDate: '2025-05-01',
      Location: 'Updated Location',
      EventDescription: 'Updated Description',
      MaxAttendees: 100,
    });
    expect(sendSuccess).toHaveBeenCalledWith(res, 'Event updated successfully', { eventID: 1, ...req.body });
  });

  //Test 2: Error if event name is invalid
  it('Should return an error if event name is invalid', async () => {

    sanitizeEventName.mockReturnValue(null);

    await updateEvent(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Invalid event name', 400);
  });

  //Test 3: Error if start date is invalid
  it('Should return an error if start date is invalid', async () => {

    sanitizeDate.mockReturnValue(null);

    await updateEvent(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Invalid start date', 400);
  });

  //Test 4: Error if location is invalid
  it('Should return an error if location is invalid', async () => {

    sanitizeLocation.mockReturnValue(null);

    await updateEvent(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Invalid location', 400);
  });

  //Test 5: Error if description is invalid
  it('Should return an error if description is invalid', async () => {
   
    sanitizeEventDescription.mockReturnValue(null);

    await updateEvent(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Invalid description', 400);
  });

  //Test 6: Error if update fails
  it('Should return an error if update fails', async () => {

    EventController.updateEvent.mockRejectedValue(new Error('Update failed'));  // Mock failure

    sendError.mockReset();
    sendError.mockImplementation(jest.fn());

    req = {
      body: {
        eventID: 1,
        EventName: 'Updated Event',
        startDate: '2025-05-01',
        endDate: '2025-05-03',
        description: 'Updated Description',
        location: 'Updated Location',
        maxAttendees: 100,
      },
      headers: {
        authorization: 'Bearer validToken',
      },
    };
  
    res = {
      json: jest.fn(),
    };
  
    await updateEvent(req, res);
  
    expect(sendError).toHaveBeenCalledWith(res, 'Server error, unable to update event', 500);
  });
  
});
