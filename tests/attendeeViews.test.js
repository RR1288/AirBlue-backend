//attendeeViews.test.js

//Set up constants
const { getEvents, getEventStatus } = require('../views/attendeeViews');
const { Attendee, Event, Itinerary } = require('../models');

// Mocks
jest.mock('../models', () => ({
  Attendee: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

//Testing time
describe('attendeeView.js', () => {
  let consoleLogSpy;

  beforeEach(() => {
    // Supress console logs during tests
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console logs after test
    consoleLogSpy.mockRestore();
  });
  
  afterEach(async () => {
    // Reset mocks before each test
    await jest.clearAllMocks();
  });

  //Tests for getEvents function
  describe('getEvents', () => {

    //Test 1: Return events for a vliad userId
    it('Should return events for a valid userId', async () => {
      // Mock the data to return
      const mockEventData = [
        {
          UserID: 1,
          Event: {
            EventName: 'Sample Event',
            EventStartDate: '2025-05-01',
            EventEndDate: '2025-05-02',
            Location: 'Sample Location',
            EventDescription: 'This is a test event'
          }
        }
      ];
      
      Attendee.findAll.mockResolvedValue(mockEventData);

      
      const result = await getEvents(1);

      // Asserts
      expect(result).toEqual(mockEventData);
      expect(Attendee.findAll).toHaveBeenCalledWith({
        attributes: [['UserID', 'id']],
        include: [
          {
            model: Event,
            attributes: [
              ['EventName', 'title'],
              ['EventStartDate', 'startDate'],
              ['EventEndDate', 'endDate'],
              ['Location', 'location'],
              ['EventDescription', 'description']
            ],
            required: true,
          }
        ],
        where: { UserID: 1 }
      });
    });

    //Test 2: Empty array if no events
    it('Should return an empty array if no events are found', async () => {
      Attendee.findAll.mockResolvedValue([]);

      const result = await getEvents(999); // User with ID 999 doesn't exist

      // Assert
      expect(result).toEqual([]);
    });

    //Test 3: Error if query fails
    it('Should throw an error if the query fails', async () => {
      // Arrange: Mock error
      Attendee.findAll.mockRejectedValue(new Error('Database error'));

      // Act and Assert: Call the function and expect an error
      await expect(getEvents(1)).rejects.toThrow('failed to get events');
    });
  });

  //Tests for getEventStatus Fucntion
  describe('getEventStatus', () => {

    //Test 4: Return event status for a valid eventId + userIds
    it('Should return event status when found using eventId and userId', async () => {
      // Arrange
      const mockEventId = 1;
      const mockUserId = 1;
      const mockStatus = {
          ApprovalStatus: 'Approved',
          TotalCost: 100,
      };
      Attendee.findOne.mockResolvedValue({
          Itinerary: [mockStatus],
      });

      // Act
      const result = await getEventStatus(mockEventId, mockUserId);

      // Assert
      expect(result).toEqual({ Itinerary: [mockStatus] });
      expect(Attendee.findOne).toHaveBeenCalledWith(expect.objectContaining({
          where: { UserID: mockUserId, EventID: mockEventId },
      }));
  });

    //Test 5: Empty array if no status found
    it('Should return an empty array if no event status is found', async () => {
      Attendee.findOne.mockResolvedValue(null);

      const result = await getEventStatus(1, 999); // EventID 999 doesn't exist

      // Assert
      expect(result).toEqual([]);
    });

    //Test 6: Throw error is query fails
    it('Should throw an error if the query fails', async () => {
      // Arrange: Mock error
      Attendee.findOne.mockRejectedValue(new Error('Database error'));

      // Act and Assert: Call the function and expect an error
      await expect(getEventStatus(1, 1)).rejects.toThrow('failed to get events');
    });
  });
});
