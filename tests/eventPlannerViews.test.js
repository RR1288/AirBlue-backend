//eventPlannerViews.test.js

//Set up constants
const { Sequelize, Attendee, Itinerary, Invitation, User, EventGroup, EventStaff, Event } = require('../models');
const eventPlannerViews = require('../views/eventPlannerViews');
const {getAttendeesForApproval} = require('../views/eventPlannerViews');
const {getAttendees} = require('../views/eventPlannerViews');

// Mocking Sequelize models
jest.mock('../models', () => ({
  Sequelize: { Op: {} },
  Attendee: {
      findAll: jest.fn(),
      count: jest.fn(), // Mock count method
  },
  Itinerary: {
      findAll: jest.fn(),
      count: jest.fn(), // Mock count method
      sum: jest.fn(), // Mock sum method
  },
  Invitation: {
      findAll: jest.fn(),
  },
  User: {
      findAll: jest.fn(),
  },
  EventGroup: {
      findAll: jest.fn(),
  },
  EventStaff: {
      findAll: jest.fn(),
  },
  Event: {
      findAll: jest.fn(),
      findOne: jest.fn(), // Mock findOne method
  },
  Slice: {
      findAll: jest.fn(),
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

      //Test 1: Return attendee data
      it('Should return formatted attendee data', async () => {
        
        const mockAttendees = [
          {
            dataValues: { attendeeID: 1 },
            User: {
              dataValues: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
            },
            Itineraries: {
              dataValues: { ApprovalStatus: 'approved', TotalCost: 500, DuffelOrderID: 123 },
            },
            EventGroup: {
              dataValues: { name: 'Group A', budget: 1000 },
            },
          },
          {
            dataValues: { attendeeID: 2 },
            User: {
              dataValues: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
            },
            Itineraries: {
              dataValues: { ApprovalStatus: 'pending', TotalCost: 300, DuffelOrderID: 456 },
            },
            EventGroup: {
              dataValues: { name: 'Group B', budget: 1500 },
            },
          },
        ];
    
        Attendee.findAll.mockResolvedValue(mockAttendees); 
    
        const eventID = 1; 
        const result = await getAttendees(eventID);
    
        expect(Attendee.findAll).toHaveBeenCalledWith({
          attributes: [["AttendeeID", "attendeeID"]],
          include: [
            {
              model: User,
              attributes: [
                ["Email", "email"],
                ["FName", "firstName"],
                ["LName", "lastName"],
              ],
              required: true,
            },
            {
              model: Itinerary,
              attributes: [
                ["ApprovalStatus", "status"],
                ["TotalCost", "cost"],
                ["DuffelOrderID", 'orderId'],
              ],
            },
            {
              model: EventGroup,
              attributes: [
                ["Name", "name"],
                ["FlightBudget", "budget"],
              ],
              required: true,
            },
          ],
          where: { EventID: eventID },
        });
    
        expect(result).toEqual([
          {
            ID: 1,
            Name: 'John Doe',
            email: 'john.doe@example.com',
            Booking: {
              dataValues: {
                ApprovalStatus: 'approved',
                TotalCost: 500,
                DuffelOrderID: 123,
              },
            },
            groupName: 'Group A',
            budget: 1000,
          },
          {
            ID: 2,
            Name: 'Jane Smith',
            email: 'jane.smith@example.com',
            Booking: {
              dataValues: {
                ApprovalStatus: 'pending',
                TotalCost: 300,
                DuffelOrderID: 456,
              },
            },
            groupName: 'Group B',
            budget: 1500,
          },
        ]);
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

        //Test 10: Return attendees for approval
        it('Should return attendees for approval if they exist', async () => {
            // Sample data for mock return
            const mockEventStaff = [
                {
                    Event: {
                        EventID: 1,
                        EventName: 'Sample Event',
                        EventStartDate: '2025-05-01',
                        EventEndDate: '2025-05-05',
                        Location: 'New York',
                        EventTotalBudget: 10000,
                        EventFlightBudget: 2000,
                        Attendees: [
                            {
                                UserID: 1,
                                User: {
                                    Email: 'attendee@example.com',
                                    FName: 'John',
                                    LName: 'Doe',
                                },
                                EventGroup: {
                                    Name: 'Group A',
                                    FlightBudget: 500,
                                },
                                Itinerary: {
                                    ItineraryID: 101,
                                    ApprovalStatus: 'pending',
                                    TotalCost: 300,
                                    BaseCost: 250,
                                    TaxCost: 50,
                                },
                                Slice: {
                                    OriginAirport: 'JFK',
                                    OriginCity: 'New York',
                                    OriginIATA: 'JFK',
                                    DestinationAirport: 'LAX',
                                    DestinationCity: 'Los Angeles',
                                    DestinationIATA: 'LAX',
                                },
                            },
                        ],
                    },
                },
            ];
    
            EventStaff.findAll.mockResolvedValue(mockEventStaff);
    
            const attendees = await getAttendeesForApproval(1);
    
            expect(attendees).toHaveLength(1); 
            expect(attendees[0].Event.EventID).toBe(1);
            expect(attendees[0].Event.Attendees[0].User.Email).toBe('attendee@example.com');
            expect(attendees[0].Event.Attendees[0].Itinerary.ApprovalStatus).toBe('pending');
        });
    
        //Test 11: Empty array if no attendees
        it('Should return an empty array when no attendees are found', async () => {
         
            EventStaff.findAll.mockResolvedValue([]);
    
            const attendees = await getAttendeesForApproval(1);
    
            expect(attendees).toHaveLength(0); 
        });

        //Test 12: Error handling
        it('Should throw an error if there is an issue with the database query', async () => {
          
            EventStaff.findAll.mockRejectedValue(new Error('Database error'));
    
            await expect(getAttendeesForApproval(1)).rejects.toThrow('failed to get attendees for event');
        });   
          
    });

    describe('getEventReportPlanner', () => {

      // Test 13: Return event report data with total attendees, approved attendees, budget, and spent amount
      it('Should return event report with total attendees, approved attendees, total budget, and total spent', async () => {
          // Mocking the necessary return values from Sequelize models
          const mockTotalAttendees = 100;
          const mockApprovedAttendees = 80;
          const mockTotalBudget = 5000;
          const mockTotalSpent = 4000;
  
          Attendee.count.mockResolvedValue(mockTotalAttendees);
          Itinerary.count.mockResolvedValue(mockApprovedAttendees);
          Event.findOne.mockResolvedValue({ dataValues: { budget: mockTotalBudget } });
          Itinerary.sum.mockResolvedValue(mockTotalSpent);
  
          const eventID = 1;
  
          const result = await eventPlannerViews.getEventReportPlanner(eventID);
  
          expect(Attendee.count).toHaveBeenCalledWith({ where: { EventID: eventID } });
          expect(Itinerary.count).toHaveBeenCalledWith({ where: { EventID: eventID, ApprovalStatus: 'approved' } });
          expect(Event.findOne).toHaveBeenCalledWith({ attributes: [['EventTotalBudget', 'budget']], where: { EventID: eventID } });
          expect(Itinerary.sum).toHaveBeenCalledWith('TotalCost', { where: { EventID: eventID, ApprovalStatus: 'approved' } });
  
          expect(result).toEqual({
              TotalAttendees: mockTotalAttendees,
              ApprovedAttendees: mockApprovedAttendees,
              TotalBudget: mockTotalBudget,
              TotalSpent: mockTotalSpent
          });
      });
  
      // Test 14: Handle when no attendees are found
      it('Should return a report with zero attendees and budget data when no attendees are found', async () => {
          const mockTotalAttendees = 0;
          const mockApprovedAttendees = 0;
          const mockTotalBudget = 5000;
          const mockTotalSpent = 0;
  
          Attendee.count.mockResolvedValue(mockTotalAttendees);
          Itinerary.count.mockResolvedValue(mockApprovedAttendees);
          Event.findOne.mockResolvedValue({ dataValues: { budget: mockTotalBudget } });
          Itinerary.sum.mockResolvedValue(mockTotalSpent);
  
          const eventID = 1;
  
          const result = await eventPlannerViews.getEventReportPlanner(eventID);
  
          expect(result).toEqual({
              TotalAttendees: mockTotalAttendees,
              ApprovedAttendees: mockApprovedAttendees,
              TotalBudget: mockTotalBudget,
              TotalSpent: mockTotalSpent
          });
      });
  
      // Test 15: Handle when event budget is missing
      it('Should handle cases where the event budget is missing', async () => {
          const mockTotalAttendees = 100;
          const mockApprovedAttendees = 80;
          const mockTotalBudget = null;
          const mockTotalSpent = 4000;
  
          Attendee.count.mockResolvedValue(mockTotalAttendees);
          Itinerary.count.mockResolvedValue(mockApprovedAttendees);
          Event.findOne.mockResolvedValue({ dataValues: { budget: mockTotalBudget } });
          Itinerary.sum.mockResolvedValue(mockTotalSpent);
  
          const eventID = 1;
  
          const result = await eventPlannerViews.getEventReportPlanner(eventID);
  
          expect(result).toEqual({
              TotalAttendees: mockTotalAttendees,
              ApprovedAttendees: mockApprovedAttendees,
              TotalBudget: null, 
              TotalSpent: mockTotalSpent
          });
      });
  
      // Test 16: Error handling
      it('Should throw an error when an exception occurs during the report generation', async () => {

          Attendee.count.mockRejectedValue(new Error('Database error'));
          
          const eventID = 1;
  
          await expect(eventPlannerViews.getEventReportPlanner(eventID)).rejects.toThrow('failed to get report');
      });
  
  });
  

});
