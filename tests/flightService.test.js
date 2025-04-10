// flightService.test.js

//Set up Constants
const flightService = require('../services/flightService');
const flightController = require('../controllers/flightController');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { validateFlightParams } = require('../utils/flightUtils');

//Mock functions
jest.mock('../controllers/flightController');
jest.mock('../utils/responseHelpers');
jest.mock('../utils/flightUtils');

//Time to test flightService.js
describe('flightService', () => {

    // Suppress console logs. I dont wanna see all that stuff in the terminal when running the tests
    beforeAll(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });

    //Tests for createRequest function
    describe('createRequest', () => {

        //Test 1: Show success when request is made
        it('Should return success when request is created successfully', async () => {
            const req = {
                query: {
                    origin: 'LGA',
                    destination: 'LAX',
                    departureDate: '2030-03-10',
                    cabinClass: 'economy',
                },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Mocking the controller method to resolve a request_id
            flightController.createOfferRequest.mockResolvedValue('12345');

            await flightService.createRequest(req, res);

            expect(validateFlightParams).toHaveBeenCalledWith(req.query);
            expect(flightController.createOfferRequest).toHaveBeenCalledWith(req.query);
            expect(sendSuccess).toHaveBeenCalledWith(res, 'Created request successfully', { request_id: '12345' });
        });

        //Test 2: Error if validation fails
        it('Should return error if validation fails', async () => {
            const req = {
                query: {
                    origin: '',
                    destination: 'LAX',
                    departureDate: '2030-03-10',
                    cabinClass: 'economy',
                },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Mocking validation failure
            validateFlightParams.mockImplementation(() => {
                throw new Error('Validation failed');
            });

            await flightService.createRequest(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'Failed to create offer request', 500);
        });
    });

    //Tests for getOffers function
    describe('getOffers', () => {

        //Test 3: Success whe we get actual offers
        it('Should return success when offers are fetched successfully', async () => {
            const req = {
                query: {
                    offer_request_id: '12345',
                    limit: '10',
                },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Mocking controller method to resolve offers
            flightController.fetchOffers.mockResolvedValue([{ offer_id: 'offer1' }]);

            await flightService.getOffers(req, res);

            expect(flightController.fetchOffers).toHaveBeenCalledWith({
                offerRequestId: '12345',
                limit: 10,
                after: undefined,
                before: undefined,
            });
            expect(sendSuccess).toHaveBeenCalledWith(res, 'Offers fetched successfully', { offers: [{ offer_id: 'offer1' }] });
        });

        //Test 4: Error if no offer request id is there
        it('Should return error if offer_request_id is missing', async () => {
            const req = {
                query: {},
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await flightService.getOffers(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'Missing required parameter: offer_request_id', 400);
        });

        //Test 5: Error if limit is invalid
        it('Should return error if limit is invalid', async () => {
            const req = {
                query: {
                    offer_request_id: '12345',
                    limit: 'ohboyIloveflyingonplanes',
                },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await flightService.getOffers(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'Invalid limit parameter', 400);
        });
    });

    //Tests for fetchFlight function
    describe('fetchFlight', () => {

        //Test 6: Success when flight is fetched
        it('Should return success when flight is fetched successfully', async () => {
            const req = { params: { offer_id: '12345' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Mocking controller method to resolve a flight
            flightController.fetchFlight.mockResolvedValue({ flight_id: 'flight1' });

            await flightService.fetchFlight(req, res);

            expect(flightController.fetchFlight).toHaveBeenCalledWith('12345');
            expect(sendSuccess).toHaveBeenCalledWith(res, 'Fetched flight successfully', { flight: { flight_id: 'flight1' } });
        });

        //Test 7: Error if no flight is found
        it('Should return error if flight is not found', async () => {
            const req = { params: { offer_id: '12345' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Mocking controller method to resolve null (not found)
            flightController.fetchFlight.mockResolvedValue(null);

            await flightService.fetchFlight(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'Flight not found', 404);
        });

        //Test 8: Error if fetching flights fails
        it('Should return error if fetching flight fails', async () => {
            const req = { params: { offer_id: '12345' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Mocking controller method to throw error
            flightController.fetchFlight.mockRejectedValue(new Error('Failed'));

            await flightService.fetchFlight(req, res);

            expect(sendError).toHaveBeenCalledWith(res, 'Failed to fetch flight', 500);
        });
    });

});
