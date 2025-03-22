//attendeeServiceCSV.test.js

//Set up constants
const {inviteAttendeesCsv} = require("../services/attendeeService");
const {sendSuccess, sendError} = require("../utils/responseHelpers");
const AttendeeController = require("../controllers/attendeeController");
const {processCSV, deleteCSV} = require("../utils/csvReader");
const {sanitizeEmail} = require("../utils/UserSanitizations");
const {validateEventGroup} = require("../utils/sanitizeEventGroup");
const {validateEventID} = require("../utils/eventSanitization");

// Mocks
jest.mock("../controllers/attendeeController");
jest.mock("../utils/csvReader");
jest.mock("../utils/UserSanitizations");
jest.mock("../utils/sanitizeEventGroup", () => ({
    validateEventGroup: jest.fn(),
}));
jest.mock("../utils/eventSanitization");
jest.mock("../utils/responseHelpers");
jest.mock("../utils/csvReader", () => ({
    processCSV: jest.fn(),
    deleteCSV: jest.fn(),
}));

//Testing time
describe("inviteAttendeesCsv", () => {
    let req;
    let res;

    let consoleLogSpy;

    afterEach(() => {
        // Restore console logs after test
        consoleLogSpy.mockRestore();
    });

    beforeEach(async () => {
        // Supress console logs during tests
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        // Clear mocks before each test
        await jest.clearAllMocks();

        req = {
            file: {path: "csv_test.csv"},
            query: {eventId: "123", eventGroupId: "456"},
        };

        res = {
            sendSuccess,
            sendError,
        };
    });

    //Test 1: Error if no file is provided
    it("Should return error if no file is provided", async () => {
        req.file.path = null;
        await inviteAttendeesCsv(req, res);
        expect(sendError).toHaveBeenCalledWith(res, "no file given", 400);
    });

    //Test 2: Error if an Id is missing
    it("Should return error if eventId or eventGroupId is missing", async () => {
        req.query = {eventId: "123"}; // Missing eventGroupId
        await inviteAttendeesCsv(req, res);
        expect(sendError).toHaveBeenCalledWith(res, "missing inputs", 400);
    });

    //Test 3: Error if an eventId is invalid
    it("Should return error if eventId is invalid", async () => {
        validateEventID.mockReturnValue(false); // Simulating invalid event ID
        await inviteAttendeesCsv(req, res);
        expect(sendError).toHaveBeenCalledWith(res, "invalid eventId", 400);
    });

    //Test 4: Error if eventGroupId is bad
    it("Should return error if eventGroupId is invalid", async () => {
        // Mocking dependencies
        validateEventID.mockReturnValue(true); // Simulating valid event ID
        validateEventGroup.mockReturnValue(false);
        await inviteAttendeesCsv(req, res);
        expect(sendError).toHaveBeenCalledWith(res, "invalid eventGroupId");
    });

    //Test 5: Success annd process CSV
    it("Should process CSV, send invites, and return success", async () => {
        // Mock req.file.path to simulate the uploaded file path
        req.file.path = "csv_test.csv";

        validateEventID.mockReturnValue(true); // Event ID is valid
        validateEventGroup.mockReturnValue(true); // Event Group ID is valid

        // Mock valid CSV data
        const csvData = [
            {Email: "user1@example.com"},
            {Email: "user2@example.com"},
        ];
        processCSV.mockResolvedValue(csvData);
        sanitizeEmail.mockImplementation((email) => email); // Just return the email as is
        AttendeeController.inviteAttendee.mockResolvedValue({success: true});

        // Call the function
        await inviteAttendeesCsv(req, res);

        // Assertions
        expect(processCSV).toHaveBeenCalledWith("csv_test.csv");
        expect(sanitizeEmail).toHaveBeenCalledWith("user1@example.com");
        expect(sanitizeEmail).toHaveBeenCalledWith("user2@example.com");
        expect(AttendeeController.inviteAttendee).toHaveBeenCalledTimes(2);
        expect(sendSuccess).toHaveBeenCalledWith(
            res,
            "successfully ran function with 2 users successfully invited and 0 failed invites",
            expect.any(Array)
        );
    });

    //Test 6: Handle missing/invalid email in CSV and skip
    it("Should handle missing or invalid email in CSV and skip invite", async () => {
        // Mock CSV with invalid email
        const csvData = [
            {Email: "user1@example.com"},
            {Email: ""}, // Invalid email
        ];
        processCSV.mockResolvedValue(csvData);
        sanitizeEmail.mockImplementation((email) => email || null);
        AttendeeController.inviteAttendee.mockResolvedValue({success: true});

        await inviteAttendeesCsv(req, res);

        expect(AttendeeController.inviteAttendee).toHaveBeenCalledTimes(1); // Only one successful invite
        expect(sendSuccess).toHaveBeenCalledWith(
            res,
            "successfully ran function with 1 users successfully invited and 1 failed invites",
            expect.any(Array)
        );
    });

    //Test 7: Handle errors during invite process
    it("Should handle errors during the invitation process and continue with the next email", async () => {
        // Mock CSV with valid and invalid email
        const csvData = [
            {Email: "user1@example.com"},
            {Email: "user2@example.com"},
        ];
        processCSV.mockResolvedValue(csvData);
        sanitizeEmail.mockImplementation((email) => email);
        AttendeeController.inviteAttendee.mockRejectedValueOnce(
            new Error("Failed")
        );

        await inviteAttendeesCsv(req, res);

        expect(AttendeeController.inviteAttendee).toHaveBeenCalledTimes(2);
        expect(sendSuccess).toHaveBeenCalledWith(
            res,
            "successfully ran function with 1 users successfully invited and 1 failed invites",
            expect.any(Array)
        );
    });

    //Test 8: Handle general errors
    it("Should handle general errors and return failure", async () => {
        processCSV.mockRejectedValue(new Error("CSV processing error"));

        await inviteAttendeesCsv(req, res);

        expect(sendError).toHaveBeenCalledWith(
            res,
            "failed to add attendees through input file"
        );
    });

    //Test 9: Delete CSV after processed
    it("Should delete the CSV file after processing", async () => {
        const deleteCSVMock = jest.fn();
        deleteCSV.mockImplementation(deleteCSVMock);

        const csvData = [{Email: "user1@example.com"}];
        processCSV.mockResolvedValue(csvData);
        sanitizeEmail.mockImplementation((email) => email);
        AttendeeController.inviteAttendee.mockResolvedValue({success: true});

        await inviteAttendeesCsv(req, res);

        expect(deleteCSVMock).toHaveBeenCalledWith("csv_test.csv");
    });
});
