// flightControllerBook.test.js

//Set up constants
const { fetchFlight } = require('../controllers/flightController'); 
jest.setTimeout(1000000); // Set timeout to 10 seconds (10000 ms)


//Mock what we need
jest.mock('node-fetch'); // Mock the fetch function
const fetch = require('node-fetch');

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
});
