//eventController.test.js

//Set up the constants
const { getAttendees, getEventStaffByRole, setEventBudget } = require("../controllers/eventController");
const { User, Event, EventStaff, Attendee, Sequelize, EventBudgetAuditLog} = require("../models");

const { Op } = require("sequelize");

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
    Op: { like: jest.fn() },
    transaction: jest.fn(),
  },
  EventBudgetAuditLog: {
    create: jest.fn(),
  },
}));

//Testing time
describe("eventController", () => {
  beforeEach(async () => {
    await jest.clearAllMocks();
  });

  //Test for getAttendees function
  describe("getAttendees", () => {

    //Test 1: Fetch attendees when given eventId
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

    //Test 2: Empty array if notin
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

  //Tests for getEventStaffByRole
  describe("getEventStaffByRole", () => {

    //Test 3: Fetch the staff via eventId and role
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

    //Test 4: Empty array if notin
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

  //Tests for setEventBudget have been moved to eventControllerSet.test.js
});
