//attendeeServiceGroupUpdate.test.js

//Constatns
const { updateAttendeeEventGroup } = require("../services/attendeeService");
const { sendError, sendSuccess } = require("../utils/responseHelpers");
const { Attendee } = require("../models");

//Mocks
jest.mock("../utils/responseHelpers", () => ({
  sendSuccess: jest.fn(),
  sendError: jest.fn(),
}));

jest.mock("../models", () => ({
  Attendee: {
    findByPk: jest.fn(),
  },
}));

//Testing time
describe('updateAttendeeEventGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Test 1: Error id no attendeeId
  it('Should return an error if Attendee ID is missing', async () => {
    const req = {
      body: {
        attendeeId: null, 
        eventGroupId: 1,
      },
    };
    const res = {};

    await updateAttendeeEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "Attendee ID is required", 400);
  });

  //Test 2: Error if eventGroupIs is missing
  it('Should return an error if Event Group ID is missing', async () => {
    const req = {
      body: {
        attendeeId: 1,
        eventGroupId: null,
      },
    };
    const res = {};

    await updateAttendeeEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "Event Group ID is required", 400);
  });

  //Test 3: Error if attendeeId is missing
  it('Should return an error if Attendee ID is invalid', async () => {
    const req = {
      body: {
        attendeeId: -1, // Invalid attendeeId
        eventGroupId: 1,
      },
    };
    const res = {};

    await updateAttendeeEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "Invalid Attendee ID", 400);
  });

  //Test 4: Error if eventGroupIs is bad
  it('Should return an error if Event Group ID is invalid', async () => {
    const req = {
      body: {
        attendeeId: 1,
        eventGroupId: -1,
      },
    };
    const res = {};

    await updateAttendeeEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "Invalid Event Group ID", 400);
  });

  //Test 5: Error if no attendee found
  it('Should return an error if attendee not found', async () => {
    const req = {
      body: {
        attendeeId: 1,
        eventGroupId: 1,
      },
    };
    const res = {};

    Attendee.findByPk.mockResolvedValue(null);

    await updateAttendeeEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "Attendee not found", 404);
  });

  //Test 6: Update and success
  it('Should update the attendee event group successfully', async () => {
    const req = {
      body: {
        attendeeId: 1,
        eventGroupId: 2,
      },
    };
    const res = {};

    const mockAttendee = {
      AttendeeID: 1,
      UserID: 123,
      EventID: 456,
      EventGroupID: 1,
      Confirmed: true,
      save: jest.fn(), 
    };

    Attendee.findByPk.mockResolvedValue(mockAttendee);

    await updateAttendeeEventGroup(req, res);

    expect(mockAttendee.save).toHaveBeenCalled();

    expect(sendSuccess).toHaveBeenCalledWith(
      res,
      "Attendee's event group updated successfully",
      expect.objectContaining({
        AttendeeID: 1,
        EventGroupID: 2, 
      })
    );
  });

  //Test 7: General errors
  it('Should handle errors during the process', async () => {
    const req = {
      body: {
        attendeeId: 1,
        eventGroupId: 2,
      },
    };
    const res = {};

    Attendee.findByPk.mockRejectedValue(new Error("Database error"));

    await updateAttendeeEventGroup(req, res);

    expect(sendError).toHaveBeenCalledWith(res, "Error updating attendee event group.", 500);
  });
});
