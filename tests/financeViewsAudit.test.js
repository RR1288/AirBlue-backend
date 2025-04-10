//financeViews.test.js

//Set up constants
const { getEventsFinance, getJoinableEventsFinance, getEventFlightReport } = require('../views/financeViews'); 
const { Event, EventStaff, Sequelize, EventBudgetAuditLog, User, Itinerary, Attendee } = require("../models");
const EventController = require("../controllers/eventController");
const financeViews = require("../views/financeViews");

//Mock it up
jest.mock('../models', () => ({
  Event: {
    findAll: jest.fn(),
    findOne: jest.fn(),
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
  },
  Itinerary: {
    sum: jest.fn(),
    count: jest.fn()
  },
  Attendee: {
    count: jest.fn()
  },

}));

jest.mock("../controllers/eventController", () => ({
  getEventStaffByRole: jest.fn(),
}));

//Tests for financeView file
describe('financeView', () => {

  
  //Tests for getbudgetLogs function
  describe('getBudgetLogs', () => {

    //Test 1: Return budget logs
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

    //Test 2: Empty array if no logs
    it('Should return an empty array if no logs are found', async () => {

        EventBudgetAuditLog.findAll.mockResolvedValue([]);

        const eventID = 1;
        const result = await financeViews.getBudgetLogs(eventID);

        expect(result).toEqual([]);
    });

    //Test 3: Error if query fails
    it('Should throw an error if the query fails', async () => {

        EventBudgetAuditLog.findAll.mockRejectedValue(new Error('Database error'));

        await expect(financeViews.getBudgetLogs(1)).rejects.toThrow('failed to get BudgetHistory');
    });
});
});
