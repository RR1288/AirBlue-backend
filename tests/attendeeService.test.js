//attendeeService.test.js

//Set up constants
const { inviteAttendee, getAttendees, revokeInvitations, cancelOwnParticipation, removeConfirmedAttendees } = require('../services/attendeeService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const AttendeeController = require('../controllers/attendeeController');

//Mock it up
jest.mock('../utils/responseHelpers', () => ({
    sendSuccess: jest.fn((res, message, data) => {
      // Simulate the behavior of res.status().json()
      res.status = jest.fn().mockReturnThis();  // Return 'res' when status() is called
      res.json = jest.fn().mockReturnThis();  // Return 'res' when json() is called
      res.status(200).json({ message, ...data });  // Call status and json in the chain
    }),
    sendError: jest.fn((res, message, statusCode = 400) => {
      // Simulate the behavior of res.status().json()
      res.status = jest.fn().mockReturnThis();  // Return 'res' when status() is called
      res.json = jest.fn().mockReturnThis();  // Return 'res' when json() is called
      res.status(statusCode).json({ message });  // Call status and json in the chain
    }),
}));
  
  

// Mock the AttendeeController methods
jest.mock('../controllers/attendeeController', () => ({
  inviteAttendee: jest.fn(),
  getAttendees: jest.fn(),
  revokeInvitations: jest.fn(),
  cancelOwnParticipation: jest.fn(),
  removeConfirmedAttendees: jest.fn(),
}));

//Testing time
describe('attendeeService tests', () => {
  let req, res;

  beforeEach(() => {
    // Mocking the req and res objects
    req = {
      params: {},
      body: {},
      user: {
        id: 'user123',
        roles: ['eventPlanner'],
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Reset the mocks before each test
    sendSuccess.mockClear();
    sendError.mockClear();
    AttendeeController.inviteAttendee.mockClear();
    AttendeeController.getAttendees.mockClear();
    AttendeeController.revokeInvitations.mockClear();
    AttendeeController.cancelOwnParticipation.mockClear();
    AttendeeController.removeConfirmedAttendees.mockClear();
  });

  //Test 1
  test('inviteAttendee - Should send success response when invitation is sent', async () => {
    req.params.eventId = 'event1';
    req.body.email = 'test@example.com';
    req.body.eventGroupId = 'group1';
    
    // Mocking the AttendeeController.inviteAttendee method to return a dummy value
    AttendeeController.inviteAttendee.mockResolvedValue({ invitationId: 'inv123' });

    await inviteAttendee(req, res);

    expect(sendSuccess).toHaveBeenCalledWith(
      res,
      'Invitation sent successfully',
      { invitation: { invitationId: 'inv123' } }
    );
  });

  //Test 2
  test('inviteAttendee - Should send error when required params are missing', async () => {
    req.params.eventId = 'event1';
    req.body.email = ''; // Missing email

    await inviteAttendee(req, res);

    expect(sendError).toHaveBeenCalledWith(
      res,
      'Event ID and email are required',
      400
    );
  });

  //Test 3
  test('getAttendees - Should send success response when attendees are fetched', async () => {
    req.params.eventId = 'event1';

    // Mocking the AttendeeController.getAttendees method to return a dummy value
    AttendeeController.getAttendees.mockResolvedValue(['attendee1', 'attendee2']);

    await getAttendees(req, res);

    expect(sendSuccess).toHaveBeenCalledWith(
      res,
      'Attendees and pending invitations fetched successfully',
      ['attendee1', 'attendee2']
    );
  });

  //Test 4
  test('revokeInvitations - Should revoke invitations successfully', async () => {
    const eventId = 1;
    const invitationIds = [2, 3];

    // Set up the mock for AttendeeController.revokeInvitations
    AttendeeController.revokeInvitations.mockResolvedValue(true);

    req.body = { eventId, invitationIds };

    // Call the function
    await revokeInvitations(req, res);

    // Check if success response is called with correct message
    expect(sendSuccess).toHaveBeenCalledWith(
      res,
      'Invitations removed successfully'
    );
  });
  //Test 5
  test('revokeInvitations - Should send error when eventId or emails are missing', async () => {
    req.body.eventId = ''; // Missing eventId

    await revokeInvitations(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Event ID and emails are required', 400);
  });

  //Test 6
  test('cancelOwnParticipation - Should send success response when participation is canceled', async () => {
    req.body.eventId = 'event1';

    // Mocking the AttendeeController.cancelOwnParticipation method to return a dummy value
    AttendeeController.cancelOwnParticipation.mockResolvedValue({ canceled: true });

    await cancelOwnParticipation(req, res);

    expect(sendSuccess).toHaveBeenCalledWith(
      res,
      'Invitation canceled successfully',
      { canceled: true }
    );
  });

  //Test 7
  test('cancelOwnParticipation - Should send error when eventId is missing', async () => {
    req.body.eventId = ''; // Missing eventId

    await cancelOwnParticipation(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Event ID is required', 400);
  });
  
});