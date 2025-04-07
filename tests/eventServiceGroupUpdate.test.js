//eventServiceGroupUpdate.test.js

//Constants
const { updateEventGroup } = require('../services/eventService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const EventController = require('../controllers/eventController');

// Mocks
jest.mock('../utils/responseHelpers', () => ({
  sendSuccess: jest.fn(),
  sendError: jest.fn(),
}));

jest.mock('../controllers/eventController', () => ({
  updateEventGroup: jest.fn(),
}));

//Testing time
describe('updateEventGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Test 1: Update group successfully
  it('Should update the event group successfully', async () => {
    const req = {
      body: {
        eventGroupID: 1,
        name: 'New Event Group Name',
        budget: 5000,
      },
    };
    const res = {};

    EventController.updateEventGroup.mockResolvedValue({
      eventGroupID: 1,
      name: 'New Event Group Name',
      flightBudget: 5000,
    });

    await updateEventGroup(req, res);

    expect(sendSuccess).toHaveBeenCalledWith(
      res,
      'Event group updated successfully',
      {
        eventGroupID: 1,
        name: 'New Event Group Name',
        flightBudget: 5000,
      }
    );
  });

  //Test 2: Return error if ID is missing
  it('Should return an error if eventGroupID is missing', async () => {
    const req = {
      body: {},
    };
    const res = {};

    await updateEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Event Group ID is required', 400);
  });

  //Test 3: Error if group name is invalid
  it('Should return an error if the event group name is invalid', async () => {
    const req = {
      body: {
        eventGroupID: 1,
        name: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Invalid name
        budget: 5000,
      },
    };
    const res = {};

    await updateEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Invalid event group name', 400);
  });

  //Test 4: Error if budget is invalid
  it('Should return an error if the flight budget is invalid', async () => {
    const req = {
      body: {
        eventGroupID: 1,
        name: 'New Event Group Name',
        budget: -1, // Invalid budget
      },
    };
    const res = {};

    await updateEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Invalid flight budget', 400);
  });

  //Test 5: General error handling
  it('Should handle unexpected errors gracefully', async () => {
    const req = {
      body: {
        eventGroupID: 1,
        name: 'Valid Group Name',
        budget: 5000,
      },
    };
    const res = {};

    EventController.updateEventGroup.mockRejectedValue(new Error('Unexpected error'));

    await updateEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 'Server error, unable to update event group', 500);
  });
});
