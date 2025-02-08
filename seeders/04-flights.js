module.exports = {
    up: async (queryInterface) => {
      return queryInterface.bulkInsert('Flights', [
        {
          FlightNumber: 'AA123',
          DepartureAirport: 'JFK',
          ArrivalAirport: 'LAX',
          ArrivalDateTime: new Date(),
          DepartureDateTime: new Date(),
          Airline: 'American Airlines',
        },
        {
          FlightNumber: 'DL456',
          DepartureAirport: 'ATL',
          ArrivalAirport: 'ORD',
          ArrivalDateTime: new Date(),
          DepartureDateTime: new Date(),
          Airline: 'Delta Airlines',
        }
      ]);
    },
    down: async (queryInterface) => {
      return queryInterface.bulkDelete('Flights', null, {});
    }
  };
  