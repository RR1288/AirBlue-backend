//eventServiceDelete.test.js

// Constatns
const { deleteEvent } = require('../services/eventService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const EventController = require('../controllers/eventController');
const jwt = require('jsonwebtoken');

// Mocks
jest.mock('../utils/responseHelpers'); 
jest.mock('../controllers/eventController'); 
jest.mock('jsonwebtoken');

//Testing time
describe('deleteEvent function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { eventID: 1 },
            headers: { authorization: 'Bearer token' }
        };
        res = {
            json: jest.fn(), 
            status: jest.fn().mockReturnThis(), 
        };

        sendSuccess.mockClear();
        sendError.mockClear();
        EventController.deleteEvent.mockClear();
        jwt.verify.mockClear();
    });

    //Test 1: Success if event deleted
    it('Should return success if event is deleted successfully', async () => {

        jwt.verify.mockReturnValue({ id: '123', OrganizationID: '1' });

        EventController.deleteEvent.mockResolvedValue(true);

        sendSuccess.mockImplementation((res, message) => res.json({ message }));

        await deleteEvent(req, res);

        expect(sendSuccess).toHaveBeenCalledWith(res, 'Event deleted successfully');
        expect(res.json).toHaveBeenCalledWith({ message: 'Event deleted successfully' });
    });

    //Test 2: Error if eventID empty
    it('Should return error if eventID is not provided', async () => {

        req.body.eventID = null;


        sendError.mockImplementation((res, message, statusCode) => res.json({ message, statusCode }));

        await deleteEvent(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'Event ID is required', 400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Event ID is required', statusCode: 400 });
    });
    

    //Test 3: Error if delete fails
    it('Should return error if event deletion fails due to server error', async () => {

        jwt.verify.mockReturnValue({ id: '123', OrganizationID: '1' });

        EventController.deleteEvent.mockRejectedValue(new Error('Server error'));

        sendError.mockImplementation((res, message) => res.json({ message }));

        await deleteEvent(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'Server error', 500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});
