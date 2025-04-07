//financeViews.test.js

//Set up constants
const { getEventsFinance, getJoinableEventsFinance } = require('../views/financeViews'); 
const { Event, EventStaff, Sequelize, EventBudgetAuditLog, User } = require("../models");
const EventController = require("../controllers/eventController");
const financeViews = require("../views/financeViews");

//Mock it up
jest.mock('../models', () => ({
  Event: {
    findAll: jest.fn(),
  },
  EventStaff: {},
  Sequelize: {
    Op: {
      like: jest.fn(),
    },
  },
  EventBudgetAuditLog: {
    findAll: jest.fn(),  
  },
  User: {
    findAll: jest.fn(),
  }

}));

jest.mock("../controllers/eventController", () => ({
  getEventStaffByRole: jest.fn(),
}));

//Tests for financeView file
describe('financeView', () => {

  //getEventsFinance functions
  describe('getEventsFinance', () => {

    //Test 1: Return events when user is found
    it('Should return events for finance user in the organization', async () => {
      const organizationId = 1;
      const userId = 2;

      // Mock Event.findAll to return a sample event list
      Event.findAll.mockResolvedValue([
        {
          dataValues: {
            id: 1,
            title: 'Event 1',
            startDate: '2025-05-01',
            endDate: '2025-05-05',
            location: 'Location 1',
            description: 'Event description',
            eventBudget: 10000,
            flightBudget: 2000,
            maxAttendees: 100,
          },
        },
      ]);

      // Mock EventStaff to ensure that the user is a finance user
      EventStaff.UserID = userId;

      const events = await getEventsFinance(organizationId, userId);

      expect(events).toHaveLength(1);
      expect(events[0].dataValues.title).toBe('Event 1');
      expect(events[0].dataValues.eventBudget).toBe(10000);
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
      const organizationId = 1;

      // Mock Event.findAll to return a list of events
      Event.findAll.mockResolvedValue([
        {
          dataValues: {
            id: 1,
            title: 'Event 1',
            startDate: '2025-05-01',
            endDate: '2025-05-05',
            location: 'Location 1',
            description: 'Event description',
            eventBudget: 10000,
            flightBudget: 2000,
            maxAttendees: 100,
          },
        },
      ]);

      // Mock getEventStaffByRole to return an empty array (no finance user)
      EventController.getEventStaffByRole.mockResolvedValue([]);

      const joinableEvents = await getJoinableEventsFinance(organizationId);

      expect(joinableEvents).toHaveLength(1);
      expect(joinableEvents[0].dataValues.title).toBe('Event 1');
      expect(joinableEvents[0].financeUser).toBe(undefined);
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

  //Tests for getbudgetLogs function
  describe('getBudgetLogs', () => {

    //Test 7: Return budget logs
    it('Should return the budget logs for an event', async () => {
      
        const mockLogs = [
            {
                dataValues: {
                    chgCol: 'Budget',
                    new: 1000,
                    original: 800,
                    dateEdited: '2025-04-06T10:00:00.000Z',
                },
                User: {
                    dataValues: {
                        user: 'financeuser@example.com',
                    },
                },
            },
        ];
        
        EventBudgetAuditLog.findAll.mockResolvedValue(mockLogs);

        const eventID = 1;
        const result = await financeViews.getBudgetLogs(eventID);

        expect(result).toEqual([
            {
                editor: 'financeuser@example.com',
                changedItem: 'Budget',
                newValue: 1000,
                priorValue: 800,
                dateEdited: '2025-04-06T10:00:00.000Z',
            },
        ]);

        expect(EventBudgetAuditLog.findAll).toHaveBeenCalledWith({
            attributes: [
                ['ColumnName', 'chgCol'],
                ['CurrentValue', 'new'],
                ['PreviousValue', 'original'],
                ['createdAt', 'dateEdited'],
            ],
            include: [
                {
                    model: User,
                    required: true,
                    attributes: [['Email', 'user']],
                },
            ],
            where: { EventID: eventID },
        });
    });

    //Test 8: Empty array if no logs
    it('Should return an empty array if no logs are found', async () => {

        EventBudgetAuditLog.findAll.mockResolvedValue([]);

        const eventID = 1;
        const result = await financeViews.getBudgetLogs(eventID);

        expect(result).toEqual([]);
    });

    //Test 9: Error if query fails
    it('Should throw an error if the query fails', async () => {

        EventBudgetAuditLog.findAll.mockRejectedValue(new Error('Database error'));

        await expect(financeViews.getBudgetLogs(1)).rejects.toThrow('failed to get BudgetHistory');
    });
});
});
