//eventPlannerViews.test.js

//Set up constants
const { Sequelize, Attendee, Itinerary, Invitation, User, EventGroup, EventStaff, Event } = require('../models');
const eventPlannerViews = require('../views/eventPlannerViews');
const {getAttendeesForApproval} = require('../views/eventPlannerViews');

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

    //Tests for getAttendeesForApproval
    describe('getAttendeesForApproval', () => {

        //Test 10: Return attendees with pending status
        it('Should return attendees with pending approval status', async () => {
         
            const mockAttendees = [
              {
                User: { dataValues: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' } },
                Itineraries: [
                  {
                    dataValues: { ApprovalStatus: 'pending', TotalCost: 100 },
                  }
                ],
                EventGroup: { dataValues: { name: 'Group A', budget: 500 } },
              },
              {
                User: { dataValues: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' } },
                Itineraries: [
                  {
                    dataValues: { ApprovalStatus: 'pending', TotalCost: 200 },
                  }
                ],
                EventGroup: { dataValues: { name: 'Group B', budget: 600 } },
              },
            ];
        
            
            Attendee.findAll.mockResolvedValue(mockAttendees);
        
           
            const eventID = 1;
            const attendees = await getAttendeesForApproval(eventID);
        
            // Assert
            expect(attendees).toHaveLength(2); 
            expect(attendees[0]).toEqual({
              Name: 'JohnDoe', 
              email: 'john.doe@example.com',
              Booking: [
                {
                  dataValues: {
                    ApprovalStatus: 'pending',
                    TotalCost: 100,
                  },
                },
              ],  
              groupName: 'Group A',
              budget: 500,
            });
        
            expect(attendees[1]).toEqual({
              Name: 'JaneSmith', 
              email: 'jane.smith@example.com',
              Booking: [
                {
                  dataValues: {
                    ApprovalStatus: 'pending',
                    TotalCost: 200,
                  },
                },
              ],  
              groupName: 'Group B',
              budget: 600,
            });
          });
      
        //Test 11: Empty array if no pending
        it('Should return empty array if no attendees have pending approval', async () => {
          
          Attendee.findAll.mockResolvedValue([]);
      
          const eventID = 1;
          const attendees = await getAttendeesForApproval(eventID);
      
          expect(attendees).toHaveLength(0);
        });
      
        //Test 12: Handle errors
        it('Should handle errors gracefully', async () => {
         
          Attendee.findAll.mockRejectedValue(new Error('Database error'));
      
          await expect(getAttendeesForApproval(1)).rejects.toThrow('failed to get attendees for event');
        });
      });


});
