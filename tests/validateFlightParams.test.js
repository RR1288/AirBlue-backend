//validateFlightParams.test.js

//Set up constants
const { validateFlightParams } = require('../utils/flightUtils');

describe('Flight Params Validation', () => {
  //First Test: Throw error if any parameters are missing
    it('Should throw an error if any required parameters are missing', () => {
    const params = { origin: 'LHR', destination: '', departureDate: '', returnDate: '', cabinClass: 'economy'};
    expect(() => validateFlightParams(params)).toThrow('Missing required query parameters: origin, destination, departureDate, and returnDate');
  });
});
