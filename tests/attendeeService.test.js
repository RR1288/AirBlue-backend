//attendeeService.test.js

//Set up constants
const attendeeService = require('../services/attendeeService');
const AttendeeController = require('../controllers/attendeeController');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

//Mock it up
jest.mock('../controllers/attendeeController');
jest.mock('../utils/responseHelpers');

//Tes time
describe('attendeeService', () => {

// Suppress console logs. I dont wanna see all that stuff in the terminal when running the tests
  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  //Tests for invinteAttendee function
  describe('inviteAttendee', () => {
    
    //Test 1: Error if eventId isn't there
    it('Should return error if eventId or email is missing', async () => {
      const req = { params: {}, body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await attendeeService.inviteAttendee(req, res);

      expect(sendError).toHaveBeenCalledWith(
        res,
        "Event ID and email are required",
        400
      );
    });

    //Test 2: Successfullt send the invite
    it('Should successfully send an invitation', async () => {
      const req = { params: { eventId: '123' }, body: { email: 'test@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockInvitation = { id: 1, email: 'test@example.com' };

      AttendeeController.inviteAttendee.mockResolvedValue(mockInvitation);

      await attendeeService.inviteAttendee(req, res);

      expect(AttendeeController.inviteAttendee).toHaveBeenCalledWith('123', 'test@example.com', undefined);
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        'Invitation sent successfully',
        { invitation: mockInvitation }
      );
    });

    //Test 3: General error handeling 
    it('Should handle errors during invitation sending', async () => {
      const req = { params: { eventId: '123' }, body: { email: 'test@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      AttendeeController.inviteAttendee.mockRejectedValue(new Error('Internal error'));

      await attendeeService.inviteAttendee(req, res);

      expect(sendError).toHaveBeenCalledWith(res, "Could not send invitation", 500);
    });
  });

  //Tests for getAttendees fucntions
  describe('getAttendees', () => {

    //Test 4: Error if evemtId is missing
    it('Should return error if eventId is missing', async () => {
      const req = { params: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await attendeeService.getAttendees(req, res);

      expect(sendError).toHaveBeenCalledWith(res, 'Event ID is required');
    });

    //Test 5: Sucessfully fetch attendees
    it('Should successfully fetch attendees', async () => {
      const req = { params: { eventId: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockAttendees = [{ id: 1, email: 'attendee1@example.com' }];

      AttendeeController.getAttendees.mockResolvedValue(mockAttendees);

      await attendeeService.getAttendees(req, res);

      expect(AttendeeController.getAttendees).toHaveBeenCalledWith('123');
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        'Attendees and pending invitations fetched successfully',
        mockAttendees
      );
    });

    //Test 6: Handle errors greacfully
    it('Should handle errors when fetching attendees', async () => {
      const req = { params: { eventId: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      AttendeeController.getAttendees.mockRejectedValue(new Error('Internal error'));

      await attendeeService.getAttendees(req, res);

      expect(sendError).toHaveBeenCalledWith(res, 'Could not get attendees', 500);
    });
  });
});
