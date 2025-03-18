// flightControllerBook.test.js

//Set up constants
const { fetchFlight } = require('../controllers/flightController'); 
const fetch = require('node-fetch');

//Mock what we need
jest.mock('node-fetch'); // Mock the fetch function

//Most of these tests are just for error catching as the success ones are in the service file

//Testing time
describe('flightController', () => {

    // Suppress console logs. I dont wanna see all that stuff in the terminal when running the tests
    beforeAll(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });


    // Tests for fetchFlight functions
    describe('fetchFlight', () => {
        
        //Test 1: Error if repsonse is not okay
        it('Should throw an error when the response is not OK', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 422,
                statusText: 'Unprocessable Entity',
                json: async () => ({ message: 'Invalid data format' }), // Simulated error body
            });

            await expect(fetchFlight('123')).rejects.toThrow('Error fetching offer');
        });

        //Test 2 Error if network error
        it('Should throw an error when there is a network error', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(fetchFlight('123')).rejects.toThrow('Error fetching offer');
        });
    });

    // // Tests for bookOfferOrHold function
    // describe('bookOfferOrHold', () => {
    //     const mockOfferId = '123';
    //     const mockPassengers = [{ name: 'John Doe', age: 30 }];
    //     const mockPayments = [{ amount: 500, method: 'credit_card' }];
    //     const mockOrderData = { data: { id: 'order123', status: 'confirmed' } };

    //     //Test 3: Error when response is not OK
    //     it('Should throw an error when the response is not OK', async () => {
            
    //         fetch.mockResolvedValueOnce({
    //             ok: false,
    //             status: 422,
    //             statusText: 'Unprocessable Entity',
    //             json: async () => ({ message: 'Invalid offer data' }), // Simulated error body
    //         });

    //         await expect(
    //             bookOfferOrHold(mockOfferId, mockPassengers, mockPayments)
    //         ).rejects.toThrow('Error booking flight');
    //     });

    //     //Test 4: Error when network error
    //     it('Should throw an error when there is a network error', async () => {
    //         fetch.mockRejectedValueOnce(new Error('Network error')); // Simulate network error

    //         await expect(bookOfferOrHold(mockOfferId, mockPassengers, mockPayments))
    //             .rejects
    //             .toThrow('Error booking flight'); // Check that the error is correctly thrown
    //     });
    // });
});
