//validateFlightParams.test.js

//Set up constants
const { validateFlightParams } = require('../utils/flightUtils');

describe('Flight Params Validation', () => {
  //First Test: Throw error if any parameters are missing
    it('Should throw an error if any required parameters are missing', () => {
    const params = { origin: 'LHR', destination: '', departureDate: '', returnDate: '', cabinClass: 'economy'};
    expect(() => validateFlightParams(params)).toThrow('Missing required query parameters: origin, destination, departureDate, and returnDate');
  });

  // //Second Test: Throw an error if if a origin is invalid
  // it('Should throw an error if the origin or destination is invalid', () => {
  //   const params = { origin: 'REDACTED', destination: 'JFK', departureDate: '2025-03-01', cabinClass: 'economy' };
  //   expect(() => validateFlightParams(params)).toThrow('Invalid IATA airport code format (must be 3 uppercase letters)');
  // });

  // //Third Test: Throw an error if if a destination is invalid
  // it('Should throw an error if the origin or destination is invalid', () => {
  //   const params = { origin: 'REDACTED', destination: 'REDACTED', departureDate: '2025-06-01', cabinClass: 'economy'};
  //   expect(() => validateFlightParams(params)).toThrow('Invalid IATA airport code format (must be 3 uppercase letters)');
  // });

  // //Fourth Test: Throw an error if the date is invalid
  // it('Should throw an error if the departure date is invalid', () => {
  //   const params = { origin: 'LHR', destination: 'JFK', departureDate: '25-2-29', cabinClass: 'economy'};
  //   expect(() => validateFlightParams(params)).toThrow('Invalid departure date format (must be YYYY-MM-DD)');
  // });

  // //Fifth Test: Throw an error if cabin class is inccorrect
  // it('Should throw an error if the cabin class is invalid', () => {
  //   const params = { origin: 'LHR', destination: 'JFK', departureDate: '2025-06-01', cabinClass: 'Super Cool Rich Kid Seating'};
  //   expect(() => validateFlightParams(params)).toThrow('Invalid cabin class. Must be one of: economy, premium_economy, business, first');
  // });

  // //Sixth Test: Throw an error if date is in the past
  // it('Should throw an error if the date is in the past', () => {
  //   const params = { origin: 'LHR', destination: 'JFK', departureDate: '1776-07-04', CabinClass: 'economy'};
  //   expect(() => validateFlightParams(params)).toThrow('Departure date cannot be in the past');
  // });
});
