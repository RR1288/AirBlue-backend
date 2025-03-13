// attendeeServiceRemove.test.js

// Constants time
const { removeAttendee } = require("../services/attendeeService");
const AttendeeController = require("../controllers/attendeeController");
const { sendSuccess, sendError } = require("../utils/responseHelpers");

// Mock it up
jest.mock("../utils/responseHelpers");
jest.mock("../controllers/attendeeController");

// Suppress all console output
beforeAll(() => {
    // Mock all console methods
    global.console = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    };
});

// Test time
describe("removeAttendee", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            user: {
                id: "requester-id",
                roles: ["Event Planner"],
            },
        };
        res = {
            send: jest.fn(),
        };
    });

    // Test 1: Error if eventId is missing
    it("Should return error if eventId is missing", async () => {
        req.body = { userId: "target-user-id" };

        await removeAttendee(req, res);

        expect(sendError).toHaveBeenCalledWith(res, "Event ID is required", 400);
    });

    // Test 2: Call removeAttendee with requesterId if userId is missing
    it("Should call removeAttendee with requesterId if userId is missing", async () => {
        req.body = { eventId: "event-id" };

        AttendeeController.removeAttendee.mockResolvedValue(true);

        await removeAttendee(req, res);

        expect(AttendeeController.removeAttendee).toHaveBeenCalledWith(
            "event-id",
            "requester-id", // requesterId used since userId is missing
            "requester-id",
            ["Event Planner"]
        );
        expect(sendSuccess).toHaveBeenCalledWith(res, "Attendee removed successfully");
    });

    // Test 3: Call function if Id is there
    it("Should call removeAttendee with userId if provided", async () => {
        req.body = { eventId: "event-id", userId: "target-user-id" };

        AttendeeController.removeAttendee.mockResolvedValue(true);

        await removeAttendee(req, res);

        expect(AttendeeController.removeAttendee).toHaveBeenCalledWith(
            "event-id",
            "target-user-id", // provided userId
            "requester-id",
            ["Event Planner"]
        );
        expect(sendSuccess).toHaveBeenCalledWith(res, "Attendee removed successfully");
    });

    // Test 4: Error if removeAttendee is not authorized
    it("Should return error if removeAttendee is not authorized or attendee not found", async () => {
        req.body = { eventId: "event-id", userId: "target-user-id" };

        AttendeeController.removeAttendee.mockResolvedValue(false);

        await removeAttendee(req, res);

        expect(sendError).toHaveBeenCalledWith(
            res,
            "Not authorized to remove this attendee or attendee not found",
            403
        );
    });

    // Test 5: General errors
    it("Should return error if an exception occurs", async () => {
        req.body = { eventId: "event-id", userId: "target-user-id" };

        AttendeeController.removeAttendee.mockRejectedValue(new Error("Test error"));

        await removeAttendee(req, res);

        expect(sendError).toHaveBeenCalledWith(res, "Internal server error", 500);
    });
});
