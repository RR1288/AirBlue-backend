//financeViews.test.js

//Set up constants
const { getEventsFinance, getJoinableEventsFinance } = require('../views/financeViews'); // Path to the file being tested
const { Event, EventStaff, Sequelize } = require("../models");
const EventController = require("../controllers/eventController");

//Mock it up
jest.mock('../models', () => ({
  Event: {
    findAll: jest.fn(),
  },
  Sequelize: {
    Op: {
      like: jest.fn(),
    },
  },
}));

jest.mock("../controllers/eventController", () => ({
  getEventStaffByRole: jest.fn(),
}));

//Tests for financeView file
describe('financeView', () => {

  //getEventsFinance functions
  describe('getEventsFinance', () => {

    //Test 1: Return events when user is found
    it('Should return events when finance user is found', async () => {
      const mockEvents = [
        {
          dataValues: {
            id: 1,
            title: 'Event 1',
            startDate: '2025-01-01',
            endDate: '2025-01-02',
            location: 'Location 1',
            description: 'Event 1 Description',
            eventBudget: 1000,
            flightBudget: 500,
            maxAttendees: 100,
          },
        },
      ];

      Event.findAll.mockResolvedValue(mockEvents);

      const result = await getEventsFinance(1, 2);

      expect(Event.findAll).toHaveBeenCalledWith(expect.objectContaining({
        include: expect.arrayContaining([
          expect.objectContaining({
            model: EventStaff,
            where: { UserID: 2, RoleID: expect.any(Object) },
          }),
        ]),
        where: { OrganizationID: 1 },
      }));

      expect(result).toEqual(mockEvents);
    });

    //Test 2: Return empty array info events found
    it('Should return empty array when no events found', async () => {
      Event.findAll.mockResolvedValue(null);

      const result = await getEventsFinance(1, 2);

      expect(result).toEqual([]);
    });

    //Test 3: Error if findAll fails
    it('Should throw error if findAll fails', async () => {
      Event.findAll.mockRejectedValue(new Error('Database error'));

      await expect(getEventsFinance(1, 2)).rejects.toThrow('failed to get events');
    });
  });

  //Tests for getJoinableEventsFinance function
  describe('getJoinableEventsFinance', () => {

    //Test 4: Return events with no finance users
    it('Should return events without finance users', async () => {
      const mockEvents = [
        {
          dataValues: {
            id: 1,
            title: 'Event 1',
            startDate: '2025-01-01',
            endDate: '2025-01-02',
            location: 'Location 1',
            description: 'Event 1 Description',
            eventBudget: 1000,
            flightBudget: 500,
            maxAttendees: 100,
          },
        },
      ];

      Event.findAll.mockResolvedValue(mockEvents);
      EventController.getEventStaffByRole.mockReturnValue(null);

      const result = await getJoinableEventsFinance(1);

      expect(Event.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { OrganizationID: 1 },
      }));
      expect(EventController.getEventStaffByRole).toHaveBeenCalledWith(1, 'F');
    });

    //Test 5: Return empty array if all the events already have a finance user attached
    it('Should return empty array if all events have finance users', async () => {
      const mockEvents = [
        {
          dataValues: {
            id: 1,
            title: 'Event 1',
            startDate: '2025-01-01',
            endDate: '2025-01-02',
            location: 'Location 1',
            description: 'Event 1 Description',
            eventBudget: 1000,
            flightBudget: 500,
            maxAttendees: 100,
          },
        },
      ];

      Event.findAll.mockResolvedValue(mockEvents);
      EventController.getEventStaffByRole.mockReturnValue({ UserID: 1 });

      const result = await getJoinableEventsFinance(1);

      expect(result).toEqual([]);
    });

    //Test 6: Throw error if findAll doesn't work
    it('Should throw error if findAll fails', async () => {
      Event.findAll.mockRejectedValue(new Error('Database error'));

      await expect(getJoinableEventsFinance(1)).rejects.toThrow('failed to get events');
    });
  });
});
