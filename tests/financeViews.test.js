//financeViews.test.js

//Set up constants
const { getEventsFinance, getJoinableEventsFinance, getEventFlightReport } = require('../views/financeViews'); 
const { Event, EventStaff, Sequelize, Itinerary, Attendee } = require("../models");
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
  Itinerary: {
    sum: jest.fn(),
    count: jest.fn(), 
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

   // Test cases for getEventFlightReport function
   describe('getEventFlightReport', () => {

    //Test 7: Return correct flight report
    it('Should fetch flight report data correctly', async () => {
      const mockEventID = 1;
      const mockEventData = {
          dataValues: {
              name: 'Sample Event',
              startDate: '2025-04-08',
              endDate: '2025-04-10',
              currentBudget: 10000,
              currentThreshold: 5000
          }
      };
  
      const mockItineraries = [
          {
              dataValues: {
                  totalCost: 200,
                  ticketCost: 150,
                  tax: 50,
                  budget: 250,
                  threshold: 300,
                  groupname: 'Group A'
              }
          }
      ];
  
      Event.findOne.mockResolvedValue(mockEventData);
      Itinerary.sum.mockResolvedValue(500);
      Itinerary.count.mockResolvedValue(10);
      Attendee.count.mockResolvedValue(15);
  
      const result = await getEventFlightReport(mockEventID);
  
      expect(result).toEqual({
          TotalSpent: 500,
          TotalAttendees: 15,
          ApporvedAttendees: 10,
          Event: {
              dataValues: {
                  name: 'Sample Event',
                  startDate: '2025-04-08',
                  endDate: '2025-04-10',
                  currentBudget: 10000,
                  currentThreshold: 5000
              }
          }
      });
  
      expect(Event.findOne).toHaveBeenCalledWith({
          attributes: [
              ['EventName', 'name'],
              ['EventStartDate', 'startDate'],
              ['EventEndDate', 'endDate'],
              ['EventTotalBudget', 'currentBudget'],
              ['FlightBudgetThreshold', 'currentThreshold']
          ],
          include: [
              {
                  model: Itinerary,
                  attributes: [
                      ['TotalCost', 'totalCost'],
                      ['BaseCost', 'ticketCost'],
                      ['TaxCost', 'tax'],
                      ['BudgetOnBook', 'budget'],
                      ['ThresholdOnBook', 'threshold'],
                      ['GroupName', 'groupname']
                  ],
                  where: { ApprovalStatus: 'approved' }
              }
          ],
          where: { EventID: mockEventID }
      });
  
      expect(Itinerary.sum).toHaveBeenCalledWith('TotalCost', {
          where: { EventID: mockEventID, ApprovalStatus: 'approved' }
      });
  
      expect(Itinerary.count).toHaveBeenCalledWith({
          where: { EventID: mockEventID, ApprovalStatus: 'approved' }
      });
  
      expect(Attendee.count).toHaveBeenCalledWith({ where: { EventID: mockEventID } });
  });

   // Test 8: Return 0 if no itineraries are approved
    it('Should return zero for total spent when no itineraries are approved', async () => {
      const eventID = 1;
      const mockApprovedAttendees = 10;
      const mockTotalAttendees = 15;
      const mockBudget = 10000;
      const mockTotalSpent = 0;
    
      Event.findOne.mockResolvedValue({
          dataValues: {
              currentBudget: mockBudget,
          },
      });

      Itinerary.sum.mockResolvedValue(mockTotalSpent);
      Attendee.count.mockResolvedValue(mockTotalAttendees);
      Itinerary.count.mockResolvedValue(mockApprovedAttendees);

      const result = await getEventFlightReport(eventID);

      expect(result).toEqual({
          TotalSpent: mockTotalSpent,
          TotalAttendees: mockTotalAttendees,
          ApporvedAttendees: mockApprovedAttendees,
          Event: {
              dataValues: {
                  currentBudget: mockBudget,
                  currentThreshold: undefined 
              }
          }
      });
    });   
    
    //Test 9: Error if findOne fails
    it('Should throw an error if Event.findOne fails', async () => {
      const eventID = 1;

      Event.findOne.mockRejectedValue(new Error('Database error'));

      await expect(getEventFlightReport(eventID)).rejects.toThrow('failed to get the flight reports');
    });

    //Test 10: Error if Itinerary math fails
    it('Should throw an error if Itinerary.sum fails', async () => {
      const eventID = 1;

      Event.findOne.mockResolvedValue({
        dataValues: {
          budget: 10000,
        },
      });

      Itinerary.sum.mockRejectedValue(new Error('Database error'));

      await expect(getEventFlightReport(eventID)).rejects.toThrow('failed to get the flight reports');
    });
  });

});
