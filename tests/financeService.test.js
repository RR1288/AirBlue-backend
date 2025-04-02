//financeService.test.js

//Set up constants 
const { setEventBudget } = require('../services/financeService');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { setEventBudget: updateEventBudget } = require('../controllers/eventController');
const { sanitizeFlightBudget, sanitizeTotalBudget, validateEventID, sanitizeThresholdValuePercent } = require('../utils/eventSanitization');

//Mock it up
jest.mock('../utils/responseHelpers');
jest.mock('../controllers/eventController');
jest.mock('../utils/eventSanitization');

//Testing time
describe('setEventBudget', () => {
    let req, res;

    beforeEach(async () => {
        // Mock the request and response objects
        req = {
            body: {
                eventID: 'event123',
                totalBudget: 1000,
                flightBudget: 500,
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        // Reset mocks before each test
        await jest.clearAllMocks();
    });

    //Test 1: Error is inputs are missing
    it('Should return an error if inputs are missing', async () => {
        req.body = {};  // No data provided

        await setEventBudget(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'missing inputs', 400);
    });

    //Test 2: Error if eventID is fake
    it('Should return an error if eventID is invalid', async () => {
        validateEventID.mockReturnValue(false);  // Fake eventID

        await setEventBudget(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'invalid EventID', 400);
    });

    //Test 3: Error if totalBudget is fake
    it('Should return an error if totalBudget is invalid', async () => {
        sanitizeTotalBudget.mockReturnValue(null);  // Invalid totalBudget
        validateEventID.mockReturnValue(true);      // Valid eventID (Needed as if not stated it will error out at evetnID)

        await setEventBudget(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'invalid budget', 400);
    });

    //Test 4: Error if flightBudget is fake
    it('Should return an error if flightBudget is invalid', async () => {
        sanitizeFlightBudget.mockReturnValue(null);  // Invalid flightBudget
        sanitizeTotalBudget.mockReturnValue(1000);   // Valid totalBudget (Same reasons as before)
        validateEventID.mockReturnValue(true);       // Valid eventID

        await setEventBudget(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'invalid flight budget', 400);
    });

    //Test 5: Error if setting budget fails
    it('Should return an error if setting the event budget fails', async () => {
        sanitizeTotalBudget.mockReturnValue(1000);  // Valid totalBudget
        sanitizeFlightBudget.mockReturnValue(500);  // Valid flightBudget
        validateEventID.mockReturnValue(true);      // Valid eventID
        updateEventBudget.mockResolvedValue(false); // Fails to set event budget

        await setEventBudget(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'failed to set budget', 400);
    });

    //Test 6: Success if event budget is set successfully
    it('Should return success if the event budget is set successfully', async () => {
        sanitizeTotalBudget.mockReturnValue(1000);  // Valid totalBudget
        sanitizeFlightBudget.mockReturnValue(500);  // Valid flightBudget
        validateEventID.mockReturnValue(true);      // Valid eventID
        sanitizeThresholdValuePercent.mockReturnValue(.5); //New addtion
        updateEventBudget.mockResolvedValue(true);  // Successfully set event budget

        await setEventBudget(req, res);

        expect(sendSuccess).toHaveBeenCalledWith(res, 'successfully updated event budget');
    });

    /*
    //Test 7: General error catching
    it('Should catch and log errors', async () => {
        const error = new Error('Test error');
        console.log = jest.fn();  // Mocking console.log
        sanitizeTotalBudget.mockReturnValue(1000);  // Valid totalBudget
        sanitizeFlightBudget.mockReturnValue(500);  // Valid flightBudget
        validateEventID.mockReturnValue(true);      // Valid eventID
        updateEventBudget.mockRejectedValue(error); // Simulate an error

        await setEventBudget(req, res);

        expect(sendError).toHaveBeenCalledWith(res, 'failed to updated event budget', 400);
        expect(console.log).toHaveBeenCalledWith(error);  // Ensure the error is logged
    });
    */
});
