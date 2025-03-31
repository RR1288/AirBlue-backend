//attendeeViews.test.js

//Constants
const { getEvents, getInvitesAttendee } = require('../views/attendeeViews');
const { Attendee, Event, Itinerary, EventGroup, Invitation, User } = require('../models');

// Mock the models
jest.mock('../models', () => ({
  Attendee: {
    findAll: jest.fn(),
  },
  Event: {},
  Itinerary: {},
  EventGroup: {},
  Invitation: {
    findAll: jest.fn(),
  },
  User: {},
}));

//Testing time for getEvents
describe('getEvents function', () => {

  /*
   // Test 1: Return formatted events data for a given userId
   it('should return formatted events data for a given userId', async () => {
    const userId = 123;

    // Simulate a mock response from the database with Itineraries being an empty array
    Attendee.findAll.mockResolvedValue([
      {
        dataValues: {
          id: 1,
          eventID: 123,
          Event: {
            dataValues: {
              title: 'Event 1',
              startDate: '2025-05-01',
              endDate: '2025-05-02',
              location: 'Location 1',
              description: 'Event description 1',
            },
          },
          Itineraries: [], // Simulate an empty Itinerary array
          EventGroup: {
            dataValues: {
              name: 'Group 1',
              budget: 1000,
            },
          },
        },
      },
      {
        dataValues: {
          id: 2,
          eventID: 456,
          Event: {
            dataValues: {
              title: 'Event 2',
              startDate: '2025-06-01',
              endDate: '2025-06-02',
              location: 'Location 2',
              description: 'Event description 2',
            },
          },
          Itineraries: [], // Simulate another empty Itinerary array
          EventGroup: {
            dataValues: {
              name: 'Group 2',
              budget: 1500,
            },
          },
        },
      },
    ]);

    const result = await getEvents(userId);
    
    // Check if the results are formatted correctly
    expect(result).toEqual([
      {
        attendeId: 1,
        eventId: 123,
        name: 'Event 1',
        startDate: '2025-05-01',
        endDate: '2025-05-02',
        location: 'Location 1',
        description: 'Event description 1',
        status: 'select', // Since Itinerary is an empty array
        cost: 0.00, // Since Itinerary is an empty array
        groupName: 'Group 1',
        flightBudget: 1000,
      },
      {
        attendeId: 2,
        eventId: 456,
        name: 'Event 2',
        startDate: '2025-06-01',
        endDate: '2025-06-02',
        location: 'Location 2',
        description: 'Event description 2',
        status: 'select', // Since Itinerary is an empty array
        cost: 0.00, // Since Itinerary is an empty array
        groupName: 'Group 2',
        flightBudget: 1500,
      },
    ]);
  });
  */
  


  //Test 2: Empty array if no events
  it('Should return an empty array if no events are found', async () => {
    // Mock the case where no events are found
    Attendee.findAll.mockResolvedValue([]);

    const userId = 123;
    const result = await getEvents(userId);

    expect(result).toEqual([]); // Expect an empty array
  });

  //test 3: General error handling
  it('Should throw an error if an exception occurs', async () => {
    // Mock an error being thrown by the findAll method
    Attendee.findAll.mockRejectedValue(new Error('Database error'));

    const userId = 123;
    await expect(getEvents(userId)).rejects.toThrow('failed to get events');
  });


// Testing time for getInvitesAttendee
describe('getInvitesAttendee function', () => {

  //Test 4: Return invite data for a given userId
  it('Should return invites data for a given userId', async () => {
    // Mock the return value of Invitation.findAll
    Invitation.findAll.mockResolvedValue([
      {
        dataValues: {
          UserID: 123,
          InviteDetails: 'Invite for event 1',
        },
      },
      {
        dataValues: {
          UserID: 123,
          InviteDetails: 'Invite for event 2',
        },
      },
    ]);

    // Call the function and check the results
    const userId = 123;
    const result = await getInvitesAttendee(userId);

    // Check if the returned result matches the expected output
    expect(result).toEqual([
      {
        dataValues: {
          UserID: 123,
          InviteDetails: 'Invite for event 1',
        },
      },
      {
        dataValues: {
          UserID: 123,
          InviteDetails: 'Invite for event 2',
        },
      },
    ]);
  });

  // Test 5: Empty array if no invites are found
  it('Should return an empty array if no invites are found', async () => {
    // Mock the case where no invites are found
    Invitation.findAll.mockResolvedValue([]);

    const userId = 123;
    const result = await getInvitesAttendee(userId);

    expect(result).toEqual([]); // Expect an empty array
  });

  // Test 6: Error handling when an exception occurs
  it('Should throw an error if an exception occurs', async () => {
    // Mock an error being thrown by the findAll method
    Invitation.findAll.mockRejectedValue(new Error('Database error'));

    const userId = 123;
    await expect(getInvitesAttendee(userId)).rejects.toThrow('failed to get invites');
  });
});
});
