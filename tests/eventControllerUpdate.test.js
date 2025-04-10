const { getAttendees, getEventStaffByRole, updateEvent } = require("../controllers/eventController");

jest.mock("../models", () => ({
    User: {
      findAll: jest.fn(),
    },
    Event: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
    },
    EventStaff: {
      findAll: jest.fn(),
    },
    Attendee: {
      findAll: jest.fn(),
    },
    Sequelize: {
      Op: {
        like: jest.fn(),
      },
    },
  }))

  describe('updateEvent', () => {
    let mockEvent;

    beforeEach(() => {
      mockEvent = {
        EventID: 1,
        EventName: 'Original Event Name',
        EventDescription: 'Original Description',
        update: jest.fn(),
      };
    });

  
    
    //Test 1: Error if event not found
    it('Should throw an error if event is not found', async () => {
      Event.findByPk = jest.fn().mockResolvedValue(null);

      const updates = {
        EventName: 'Updated Event Name',
        EventDescription: 'Updated Description',
      };

      await expect(updateEvent(999, updates)).rejects.toThrow('Failed to update event');
    });

    //Test 2: Error if update fails
    it('Should throw an error if update fails', async () => {
      Event.findByPk = jest.fn().mockResolvedValue(mockEvent);

      const updates = {
        EventName: 'Updated Event Name',
        EventDescription: 'Updated Description',
      };

      mockEvent.update.mockRejectedValue(new Error('Update failed'));

      await expect(updateEvent(1, updates)).rejects.toThrow('Failed to update event');
    });
  });

