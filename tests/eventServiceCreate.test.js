// eventServiceCreate.test.js

// Set up constants
const { createEvent, getAvailableEventTypes } = require('../services/eventService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { validateUserID } = require("../utils/UserSanitizations");
const { sanitizeEventName, sanitizeEventDescription, sanitizeDate } = require("../utils/eventSanitization");
const { validateEventType } = require("../utils/eventTypeSantization");
const { validateOrganizationID } = require("../utils/OrganizationSanitization");
const jwt = require('jsonwebtoken');
const { getEventTypes, createEvent: createEventController } = require("../controllers/eventController");

// Mock the necessary dependencies
jest.mock('../utils/responseHelpers');
jest.mock('../utils/UserSanitizations');
jest.mock("../utils/eventSanitization");
jest.mock("../utils/eventTypeSantization");
jest.mock("../utils/OrganizationSanitization"); 
jest.mock('../controllers/eventController', () => ({
    createEvent: jest.fn(), 
    getEventTypes: jest.fn(), 
  }));
jest.mock('jsonwebtoken');

// Start Testing
describe('Event Service Create Tests', () => {
    let req, res;

    // Suppress console logs
    beforeAll(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });

    beforeEach(() => {
        // Setup mock request and response
        req = {
            body: {
                name: 'Event Test',
                startDate: '2025-03-15T10:00:00Z',
                endDate: '2025-03-16T10:00:00Z',
                typeID: 1,
                location: "Rochester, NY",
                maxAttendees: 500,
            },
            headers: {
                authorization: 'Bearer fakeToken'
            },
        };

        res = {
            sendSuccess: sendSuccess,
            sendError: sendError
        };
    });

    // Testing for createEvent
    describe('createEvent', () => {

        // Test 1: Error if fields are missing
        it('Should return error if required fields are missing', async () => {
            // Simulate missing name
            req.body.name = undefined;

            await createEvent(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "missing required inputs");
        });

        // Test 2: Error if a user is invalid
        it('Should return error if user is invalid', async () => {
            jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
            validateUserID.mockReturnValue(false);  // Mock invalid user

            await createEvent(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "User does not exist", 404);
        });

        // Test 3: Error if organization is invalid
        it('Should return error if organization is invalid', async () => {
            jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
            validateUserID.mockReturnValue(true);
            validateEventType.mockReturnValue(true);
            validateOrganizationID.mockReturnValue(false); // Mock invalid organization

            await createEvent(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "Organization does not exist", 404);
        });

        // Test 4: Error if event name is not allowed
        it('should return error if event name is invalid', async () => {
            jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
            validateUserID.mockReturnValue(true);
            validateOrganizationID.mockReturnValue(true);
            sanitizeEventName.mockReturnValue(null);  // Mock invalid name

            await createEvent(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "event Name is invalid", 400);
        });

        // Test 5: Error if date is invalid
        it('Should return error if start date is invalid', async () => {
            jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
            validateUserID.mockReturnValue(true);
            validateOrganizationID.mockReturnValue(true);
            sanitizeEventName.mockReturnValue('Event Test');
            sanitizeDate.mockReturnValue(null);

            await createEvent(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "invalid start date", 400);
        });

        // Test 6: Error if event type isn't found
        it('Should return error if event type is not found', async () => {
            jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
            validateUserID.mockReturnValue(true);
            validateOrganizationID.mockReturnValue(true);
            sanitizeEventName.mockReturnValue('Event Test');
            sanitizeDate.mockReturnValue('2025-03-15T10:00:00Z');
            validateEventType.mockReturnValue(false); // Mock invalid event type

            await createEvent(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "event type not found", 404);
        });

        // Test 7: Success if all is good
        it('Should return success if event is created successfully', async () => {
            jwt.verify.mockReturnValue({ id: '1', OrganizationID: '1' });
            validateUserID.mockReturnValue(true);
            validateOrganizationID.mockReturnValue(true);
            sanitizeEventName.mockReturnValue('Event Test');
            sanitizeDate.mockReturnValue('2030-03-15T10:00:00Z');
            validateEventType.mockReturnValue(true);

            // Ensure `createEventController` is mocked properly
            createEventController.mockResolvedValue(1);  // Mock event creation successfully

            await createEvent(req, res);

            expect(sendSuccess).toHaveBeenCalledWith(res, "event created successfully", 1);
        });

        // Test 8: General graceful errors
        it('should handle server errors gracefully', async () => {
            jwt.verify.mockImplementation(() => { throw new Error('token error'); });

            await createEvent(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "server error");
        });
    });

    // Tests for getAvailableEventTypes function
    describe('getAvailableEventTypes', () => {

        // Test 9: Error if organization is invalid
        it('Should return error if organization is invalid', async () => {
            jwt.verify.mockReturnValue({ OrganizationID: '1' });
            validateOrganizationID.mockReturnValue(false); // Mock invalid organization

            await getAvailableEventTypes(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "Organization does not exist", 404);
        });

        // Test 10: Return the event types
        it('Should return event types successfully', async () => {
            jwt.verify.mockReturnValue({ OrganizationID: '1' });
            validateOrganizationID.mockReturnValue(true);
            getEventTypes.mockResolvedValue([{ id: 1, name: 'Conference' }]); // Mock event types

            await getAvailableEventTypes(req, res);

            expect(sendSuccess).toHaveBeenCalledWith(res, "successfully got event types", [{ id: 1, name: 'Conference' }]);
        });

        // Test 11: Error if can't get event types
        it('Should return error if failed to get event types', async () => {
            jwt.verify.mockReturnValue({ OrganizationID: '1' });
            validateOrganizationID.mockReturnValue(true);
            getEventTypes.mockResolvedValue(null); // Mock failed event types fetch

            await getAvailableEventTypes(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "failed to get event types", 400);
        });

        // Test 12: General graceful errors
        it('Should handle server errors gracefully', async () => {
            jwt.verify.mockImplementation(() => { throw new Error('token error'); });

            await getAvailableEventTypes(req, res);

            expect(sendError).toHaveBeenCalledWith(res, "server error");
        });
    });
});