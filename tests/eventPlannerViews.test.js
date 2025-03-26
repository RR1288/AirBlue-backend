//eventPlannerViews.test.js

//Set up constants
const { Sequelize, Attendee, Itinerary, Invitation, User, EventGroup, EventStaff, Event } = require('../models');
const eventPlannerViews = require('../views/eventPlannerViews');

// Mocking Sequelize models
jest.mock('../models', () => ({
    Sequelize: { Op: {} },
    Attendee: {
        findAll: jest.fn()
    },
    Itinerary: {},
    Invitation: {
        findAll: jest.fn()
    },
    User: {},
    EventGroup: {},
    EventStaff: {},
    Event: {
        findAll: jest.fn()
    }
}));

//Testing time
describe('EventPlannerViews', () => {

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    //Tests for getAttendees function
    describe('getAttendees', () => {

      //Test 1: Return a list of attendees and their deets
      it('Should return a list of attendees with their details', async () => {
        
        const mockAttendees = [{
            User: { dataValues: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' } },
            Itineraries: { dataValues: { ApprovalStatus: 'Approved', TotalCost: 100 } },
            EventGroup: { dataValues: { name: 'Group A', budget: 1000 } },
        }];
    
        
        Attendee.findAll.mockResolvedValue(mockAttendees);
    
        const result = await eventPlannerViews.getAttendees(1);
    
        expect(result).toEqual([{
            Name: 'JohnDoe',
            email: 'john@example.com',
            Booking: { dataValues: { ApprovalStatus: 'Approved', TotalCost: 100 } }, // Include 'dataValues'
            groupName: 'Group A',
            budget: 1000
        }]);
    });

        //Test 2: Handle empty attendees
        it('Should handle empty attendees', async () => {
            // Mock findAll to return empty array
            Attendee.findAll.mockResolvedValue([]);

            const result = await eventPlannerViews.getAttendees(1);

            expect(result).toEqual([]);
        });

        //Test 3: Error if exception occurs
        it('Should throw an error when an exception occurs', async () => {
            // Mock findAll to throw error
            Attendee.findAll.mockRejectedValue(new Error('Database error'));

            await expect(eventPlannerViews.getAttendees(1)).rejects.toThrow('failed to get attendees for event');
        });
    });

    //Tests for getInvitees function
    describe('getInvitees', () => {

        //Test 4: Return list of invitees and their deets
        it('Should return a list of invitees with their details', async () => {
            const mockInvitees = [{
                dataValues: { email: 'invitee@example.com', status: 'Pending' },
                eventGroup: { dataValues: { name: 'Group B' } }
            }];

            Invitation.findAll.mockResolvedValue(mockInvitees);

            const result = await eventPlannerViews.getInvitees(1);

            expect(result).toEqual([{
                email: 'invitee@example.com',
                status: 'Pending',
                groupName: 'Group B'
            }]);
        });

        //Test 5: Handle empty invitees
        it('Should handle empty invitees', async () => {
            Invitation.findAll.mockResolvedValue([]);

            const result = await eventPlannerViews.getInvitees(1);

            expect(result).toEqual([]);
        });

        //Test 6: Error if exception occurs
        it('Should throw an error when an exception occurs', async () => {
            Invitation.findAll.mockRejectedValue(new Error('Database error'));

            await expect(eventPlannerViews.getInvitees(1)).rejects.toThrow('failed to get invited users');
        });
    });

    //Tests for getEventsPlanner function
    describe('getEventsPlanner', () => {

      //Test 7: Return list of events for a planner
      it('Should return a list of events for a planner', async () => {
        const mockEvents = [{
            dataValues: {
                id: 1,
                title: 'Event 1',
                startDate: '2025-05-01',
                endDate: '2025-05-02',
                location: 'New York',
                description: 'Test Event',
                eventBudget: 5000,
                flightBudget: 1000,
                maxAttendees: 50,
                expectedAttendees: 30
            }
        }];
    
        Event.findAll.mockResolvedValue(mockEvents);
    
        const result = await eventPlannerViews.getEventsPlanner(1, 1);
    
        expect(result).toEqual([{
            dataValues: {
                id: 1,
                title: 'Event 1',
                startDate: '2025-05-01',
                endDate: '2025-05-02',
                location: 'New York',
                description: 'Test Event',
                eventBudget: 5000,
                flightBudget: 1000,
                maxAttendees: 50,
                expectedAttendees: 30
            }
        }]);
    });

        //Test 8: Handle no events 
        it('Should handle no events found', async () => {
            Event.findAll.mockResolvedValue([]);

            const result = await eventPlannerViews.getEventsPlanner(1, 1);

            expect(result).toEqual([]);
        });

        //Test 9: Error if exception
        it('Should throw an error when an exception occurs', async () => {
            Event.findAll.mockRejectedValue(new Error('Database error'));

            await expect(eventPlannerViews.getEventsPlanner(1, 1)).rejects.toThrow('failed to get events');
        });
    });
});
