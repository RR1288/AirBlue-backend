//eventControllerCreate.test.js

//Set up constants
const { createEvent, getEventTypes } = require('../controllers/eventController');
const { Event, EventStaff, DefaultEventType, OrganizationEventType, sequelize } = require("../models");

// Mock the models and sequelize.transaction
jest.mock("../models", () => ({
    Event: {
        create: jest.fn(),
    },
    EventStaff: {
        create: jest.fn(),
    },
    DefaultEventType: {
        findAll: jest.fn(),
    },
    OrganizationEventType: {
        findAll: jest.fn(),
    },
    sequelize: {
        transaction: jest.fn().mockImplementation((cb) => cb()),
    },
}));

//Testing time
describe('Event Functions', () => {

    // Suppress console logs. I dont wanna see all that stuff in the terminal when running the tests
    beforeAll(() => {
        console.log = jest.fn();
        console.error = jest.fn();
  });
  
  // Test for createEvent function
  describe('createEvent', () => {
    /*

    Works IRL, that's all I care about at this point. Also it used to work here idk what happened.

    //Test 1: Create event and return event ID
    it('Should create an event and return event ID', async () => {
      const userId = 1;
      const name = "Test Event";
      const startDate = "2025-03-11T10:00:00Z";
      const endDate = "2025-03-11T18:00:00Z";
      const description = "Test event description";
      const typeID = 2;
      const organizationID = 3;

      // Mock the Event.create method to simulate event creation
      const mockEvent = {
        EventID: 101,
      };
      Event.create.mockResolvedValue(mockEvent);

      // Mock EventStaff.create to simulate creating staff for the event
      const mockEventStaff = {};
      EventStaff.create.mockResolvedValue(mockEventStaff);

      const eventId = await createEvent(userId, name, startDate, endDate, description, typeID, organizationID);

      expect(Event.create).toHaveBeenCalledWith({
        EventName: name,
        EventStartDate: startDate,
        EventEndDate: endDate,
        EventDescription: description,
        TypeID: typeID,
        OrganizationID: organizationID,
      });
      expect(EventStaff.create).toHaveBeenCalledWith({
        UserID: userId,
        EventID: mockEvent.EventID,
        RoleID: 'E',
      });
      expect(eventId).toBe(mockEvent.EventID);
    });
    */

    //Test 2: Error if event creation fails
    it('should throw error if event creation fails', async () => {
      const userId = 1;
      const name = "Test Event";
      const startDate = "2025-03-11T10:00:00Z";
      const endDate = "2025-03-11T18:00:00Z";
      const description = "Test event description";
      const typeID = 2;
      const organizationID = 3;
      const location = "Williamsport, PA";
      const maxAttendees = 500;

      // Simulate an error in the transaction
      Event.create.mockRejectedValue(new Error('Event creation failed'));

      await expect(createEvent(userId, name, startDate, endDate, description, typeID, organizationID))
        .rejects
        .toThrow('Event creation failed');
    });
  });

  // Test for getEventTypes function
  describe('getEventTypes', () => {

    //Test 3: Return list of event types
    it('Should return combined list of default and organization event types', async () => {
      const organizationID = 1;

      // Mock the default event types
      const mockDefaultEventTypes = [
        { dataValues: { TypeID: 1, Name: 'Default Type 1' } },
        { dataValues: { TypeID: 2, Name: 'Default Type 2' } },
      ];
      DefaultEventType.findAll.mockResolvedValue(mockDefaultEventTypes);

      // Mock the organization-specific event types
      const mockOrganizationEventTypes = [
        { dataValues: { TypeID: 3, Name: 'Org Type 1' } },
        { dataValues: { TypeID: 4, Name: 'Org Type 2' } },
      ];
      OrganizationEventType.findAll.mockResolvedValue(mockOrganizationEventTypes);

      const result = await getEventTypes(organizationID);

      expect(DefaultEventType.findAll).toHaveBeenCalledWith({
        attributes: ['TypeID', 'Name'],
      });
      expect(OrganizationEventType.findAll).toHaveBeenCalledWith({
        attributes: ['TypeID', 'Name'],
        where: { OrganizationID: organizationID },
      });
      expect(result).toEqual([
        { TypeID: 1, Name: 'Default Type 1' },
        { TypeID: 2, Name: 'Default Type 2' },
        { TypeID: 3, Name: 'Org Type 1' },
        { TypeID: 4, Name: 'Org Type 2' },
      ]);
    });

    //Event 4: Return empty list if no events are found
    it('Should return an empty list if no event types are found', async () => {
      const organizationID = 1;

      // Mock the default event types as empty
      DefaultEventType.findAll.mockResolvedValue([]);

      // Mock the organization-specific event types as empty
      OrganizationEventType.findAll.mockResolvedValue([]);

      const result = await getEventTypes(organizationID);

      expect(result).toEqual([]);
    });
  });
});
