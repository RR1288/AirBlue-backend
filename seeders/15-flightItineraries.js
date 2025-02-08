module.exports = {
    up: async (queryInterface) => {
      return queryInterface.bulkInsert('FlightItineraries', [
        {
          ItineraryID: 1,  // Itinerary of User 1
          FlightID: 1,
          Class: 'Economy',
          SeatNumber: '12A',
        },
        {
          ItineraryID: 2,  // Itinerary of User 2
          FlightID: 2,
          Class: 'Business',
          SeatNumber: '5B',
        },
        {
          ItineraryID: 3,  // Itinerary of User 3
          FlightID: 1,
          Class: 'First Class',
          SeatNumber: '1A',
        },
        {
          ItineraryID: 4,  // Itinerary of User 4
          FlightID: 1,
          Class: 'Economy',
          SeatNumber: '14C',
        },
        {
          ItineraryID: 5,  // Itinerary of User 5
          FlightID: 2,
          Class: 'Economy',
          SeatNumber: '20D',
        },
        {
          ItineraryID: 6,  // Itinerary of User 6
          FlightID: 2,
          Class: 'Business',
          SeatNumber: '6F',
        },
        {
          ItineraryID: 7,  // Itinerary of User 7
          FlightID: 1,
          Class: 'First Class',
          SeatNumber: '2B',
        },
        {
          ItineraryID: 8,  // Itinerary of User 8
          FlightID: 2,
          Class: 'Economy',
          SeatNumber: '15A',
        },
        {
          ItineraryID: 9,  // Itinerary of User 9
          FlightID: 1,    
          Class: 'Business',
          SeatNumber: '4C',
        },
        {
          ItineraryID: 10, // Itinerary of User 10
          FlightID: 2,    
          Class: 'Economy',
          SeatNumber: '18E',
        },
      ]);
    },
  
    down: async (queryInterface) => {
      return queryInterface.bulkDelete('FlightItineraries', null, {});
    }
  };
  