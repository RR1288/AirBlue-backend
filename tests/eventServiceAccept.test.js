//eventServiceAccept.test.js

//Set up constants
const { acceptInvitation } = require('../services/eventService');  
const { sendError, sendSuccess } = require('../utils/responseHelpers');
const EventController = require('../controllers/eventController');

//Mock what's needed
jest.mock('../utils/responseHelpers');
jest.mock('../controllers/eventController');

//Test Time for acceptInvitation function
describe('acceptInvitation', () => {
  let req, res;

  beforeEach(() => {
    // Mock the req and res objects
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  //Test 1: Error if invitation is missing
  it('Should return error if invitation is missing', async () => {
    req.query = {}; // No invitation token

    await acceptInvitation(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Invitation token is required', 400);
  });

  //Test 2: Error if invitation is invalid/expired
  it('should return error if invitation is invalid or expired', async () => {
    req.query = { invitation: 'invalidToken' };

   
    EventController.processInvitationAcceptance.mockResolvedValue(null);

    await acceptInvitation(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Invalid or expired invitation', 400);
  });

  //Test 3: Success whenn everything is good
  it('Should return success if invitation is accepted', async () => {
    req.query = { invitation: 'validToken' };

    // Mock the EventController.processInvitationAcceptance to return true (successful acceptance)
    EventController.processInvitationAcceptance.mockResolvedValue(true);

    await acceptInvitation(req, res);

    expect(sendSuccess).toHaveBeenCalledWith(res, 'Invitation accepted successfully');
  });

  //Test 4: Error if there is a server error
  it('Should return error if there is a server error', async () => {
    req.query = { invitation: 'validToken' };

    // Mock the EventController.processInvitationAcceptance to throw an error
    EventController.processInvitationAcceptance.mockRejectedValue(new Error('Server Error'));

    await acceptInvitation(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Internal server error', 500);
  });
});
