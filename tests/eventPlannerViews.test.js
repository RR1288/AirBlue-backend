//eventPlanenrViews.test.js

//Constants
const { Sequelize, Attendee, Itinerary, Invititation, User, EventGroup, EventStaff, Event } = require('../models');
const eventPlannerViews = require('../views/eventPlannerViews');

//Mock time 
jest.mock('../models', () => ({
  Sequelize: {
    Op: {
      like: jest.fn()
    }
  },
  Attendee: {
    findAll: jest.fn()
  },
  Itinerary: {
    findAll: jest.fn()
  },
  Invititation: {
    findAll: jest.fn()
  },
  User: {
    findAll: jest.fn()
  },
  EventGroup: {
    findAll: jest.fn()
  },
  EventStaff: {
    findAll: jest.fn()
  },
  Event: {
    findAll: jest.fn()
  }
}));

//Testing time
describe('Event Planner Views', () => {

  //Tests for getAttendees function
  describe('getAttendees', () => {
    
    //Test 1: Return correct attendees for an event
    it('Should return the correct attendees for an event', async () => {
      const mockAttendees = [
        {
          dataValues: {
            User: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
            Itinerary: { cost: 100, status: 'pending' },
            EventGroup: { name: 'Group A', budget: 500 }
          }
        },
        {
          dataValues: {
            User: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' },
            Itinerary: { cost: 200, status: 'approved' },
            EventGroup: { name: 'Group B', budget: 400 }
          }
        }
      ];

      Attendee.findAll.mockResolvedValue(mockAttendees);

      const eventID = 1;
      const result = await eventPlannerViews.getAttendees(eventID);

      expect(result).toEqual([
        {
          Name: 'JohnDoe',
          email: 'john@example.com',
          status: 'pending',
          bookingCost: 100,
          groupName: 'Group A',
          budget: 500
        },
        {
          Name: 'JaneDoe',
          email: 'jane@example.com',
          status: 'approved',
          bookingCost: 200,
          groupName: 'Group B',
          budget: 400
        }
      ]);
    });

    //Test 2: Return empty array if no attendees
    it('Should return empty array if no attendees found', async () => {
      Attendee.findAll.mockResolvedValue([]);

      const eventID = 1;
      const result = await eventPlannerViews.getAttendees(eventID);

      expect(result).toEqual([]);
    });
  });

  //Tests for getInvitees function
  describe('getInvitees', () => {

    //Test 3: Return correct invitees for event
    it('Should return the correct invitees for an event', async () => {
        const mockInvitees = [
            {
                dataValues: {
                    email: 'invitee1@example.com',
                    status: 'pending',
                    EventGroup: { name: 'Group A' }
                }
            },
            {
                dataValues: {
                    email: 'invitee2@example.com',
                    status: 'accepted',
                    EventGroup: { name: 'Group B' }
                }
            }
        ];

        Invititation.findAll.mockResolvedValue(mockInvitees);

        const eventID = 1;
        const result = await eventPlannerViews.getInvitees(eventID);

        expect(result).toEqual([
            { email: 'invitee1@example.com', status: 'pending', groupName: 'Group A' },
            { email: 'invitee2@example.com', status: 'accepted', groupName: 'Group B' }
        ]);
    });

    //Test 4: Empty array if no invitees
    it('Should return empty array if no invitees found', async () => {
      Invititation.findAll.mockResolvedValue([]);

      const eventID = 1;
      const result = await eventPlannerViews.getInvitees(eventID);

      expect(result).toEqual([]);
    });
  });

  //Tests for getEventsPlanner function
  describe('getEventsPlanner', () => {

    //Test 5: Return events per user and organization
    it('Should return events for a specific user and organization', async () => {
      const mockEvents = [
        {
          dataValues: {
            id: 1,
            title: 'Event 1',
            startDate: '2025-01-01',
            endDate: '2025-01-02',
            location: 'Location 1',
            description: 'Event 1 description',
            eventBudget: 1000,
            flightBudget: 500,
            maxAttendees: 100,
            expectedAttendees: 80
          }
        },
        {
          dataValues: {
            id: 2,
            title: 'Event 2',
            startDate: '2025-02-01',
            endDate: '2025-02-02',
            location: 'Location 2',
            description: 'Event 2 description',
            eventBudget: 1500,
            flightBudget: 700,
            maxAttendees: 150,
            expectedAttendees: 120
          }
        }
      ];

      Event.findAll.mockResolvedValue(mockEvents);

      const organizationId = 1;
      const userId = 2;
      const result = await eventPlannerViews.getEventsPlanner(organizationId, userId);

      expect(result).toEqual(mockEvents);
    });

    //Test 6: Retrun an empty array if no events
    it('Should return empty array if no events found', async () => {
      Event.findAll.mockResolvedValue([]);

      const organizationId = 1;
      const userId = 2;
      const result = await eventPlannerViews.getEventsPlanner(organizationId, userId);

      expect(result).toEqual([]);
    });
  });
});
