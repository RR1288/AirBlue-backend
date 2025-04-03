//eventController.test.js

//Set up the constants
const { getAttendees, getEventStaffByRole, setEventBudget } = require("../controllers/eventController");
const { User, Event, EventStaff, Attendee, Sequelize } = require("../models");

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
}));

describe("eventController", () => {
  beforeEach(async () => {
    await jest.clearAllMocks();
  });

  describe("getAttendees", () => {
    it("Should fetch attendees for a given eventId", async () => {
      const mockEventId = 1;
      const mockAttendees = [
        {
          User: { UserID: 1, FName: "John", LName: "Doe", Email: "john.doe@example.com" },
          Event: { EventID: 1, EventName: "Event 1" },
        },
      ];

      Attendee.findAll.mockResolvedValue(mockAttendees);

      const result = await getAttendees(mockEventId);

      expect(Attendee.findAll).toHaveBeenCalledWith({
        where: { EventID: mockEventId },
        include: [
          { model: User, attributes: ["UserID", "FName", "LName", "Email"] },
          { model: Event, attributes: ["EventID", "EventName"] },
        ],
      });
      expect(result).toEqual(mockAttendees);
    });

    it("Should return an empty array if no attendees found", async () => {
      const mockEventId = 1;
      Attendee.findAll.mockResolvedValue([]);

      const result = await getAttendees(mockEventId);

      expect(Attendee.findAll).toHaveBeenCalledWith({
        where: { EventID: mockEventId },
        include: [
          { model: User, attributes: ["UserID", "FName", "LName", "Email"] },
          { model: Event, attributes: ["EventID", "EventName"] },
        ],
      });
      expect(result).toEqual([]);
    });
  });

  describe("getEventStaffByRole", () => {
    it("Should fetch event staff based on eventId and role", async () => {
      const mockEventId = 1;
      const mockRole = "E";
      const mockEventStaff = [
        {
          User: { UserID: 1, FName: "Jane", LName: "Doe", Email: "jane.doe@example.com" },
          Event: { EventID: 1, EventName: "Event 1" },
        },
      ];

      EventStaff.findAll.mockResolvedValue(mockEventStaff);

      const result = await getEventStaffByRole(mockEventId, mockRole);

      expect(EventStaff.findAll).toHaveBeenCalledWith({
        where: {
          EventID: mockEventId,
          RoleID: { [Sequelize.Op.like]: `%${mockRole}%` },
        },
        include: [
          { model: User, attributes: ["UserID", "FName", "LName", "Email"] },
          { model: Event, attributes: ["EventID", "EventName"] },
        ],
      });
      expect(result).toEqual(mockEventStaff);
    });

    it("Should return an empty array if no event staff found", async () => {
      const mockEventId = 1;
      const mockRole = "F";
      EventStaff.findAll.mockResolvedValue([]);

      const result = await getEventStaffByRole(mockEventId, mockRole);

      expect(EventStaff.findAll).toHaveBeenCalledWith({
        where: {
          EventID: mockEventId,
          RoleID: { [Sequelize.Op.like]: `%${mockRole}%` },
        },
        include: [
          { model: User, attributes: ["UserID", "FName", "LName", "Email"] },
          { model: Event, attributes: ["EventID", "EventName"] },
        ],
      });
      expect(result).toEqual([]);
    });
  });

  //Tests for setEventBudget
  describe('setEventBudget', () => {
    let eventData;

    beforeEach(() => {
        eventData = {
            EventID: 1,
            EventTotalBudget: 10000,
            EventFlightBudget: 2000,
            FlightBudgetThreshold: 0.5 // Threshold as a decimal (e.g., 0.5 = 50%)
        };
    });

    //Test 5: Successfully update budget
    it('Should successfully update event budget when event exists', async () => {
    
      const mockEvent = {
          update: jest.fn().mockResolvedValue(true), 
          EventID: 1,
          EventFlightBudget: 2000
      };

      Event.findByPk = jest.fn().mockResolvedValue(mockEvent);

      const result = await setEventBudget(1, 10000, 2000, 0.5);

      expect(result).toBe(true);
      expect(Event.findByPk).toHaveBeenCalledWith(1);
      expect(mockEvent.update).toHaveBeenCalledWith({
          EventTotalBudget: 10000,
          EventFlightBudget: 2000,
          FlightBudgetThreshold: 0.5
      });
  });

    //Test 6: Handle errors
    it('Should handle errors when updating event budget', async () => {

        Event.findByPk = jest.fn().mockResolvedValue({
            update: jest.fn().mockRejectedValue(new Error('Database Error'))
        });

        await expect(setEventBudget(1, 10000, 2000, 0.5)).rejects.toThrow('failed to add budget');
    });
});
});
