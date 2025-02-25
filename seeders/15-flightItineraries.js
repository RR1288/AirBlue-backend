module.exports = {
    up: async (queryInterface) => {
      return queryInterface.bulkInsert('FlightItineraries', [
        {
          ItineraryID: 1,  // Itinerary of User 1
          FlightID: 1,
          Class: 'Economy',
          SeatNumber: '12A',
          createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          ItineraryID: 2,  // Itinerary of User 2
          FlightID: 2,
          Class: 'Business',
          SeatNumber: '5B',
          createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          ItineraryID: 3,  // Itinerary of User 3
          FlightID: 1,
          Class: 'First Class',
          SeatNumber: '1A',
          createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          ItineraryID: 4,  // Itinerary of User 4
          FlightID: 1,
          Class: 'Economy',
          SeatNumber: '14C',
          createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          ItineraryID: 5,  // Itinerary of User 5
          FlightID: 2,
          Class: 'Economy',
          SeatNumber: '20D',
          createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          ItineraryID: 6,  // Itinerary of User 6
          FlightID: 2,
          Class: 'Business',
          SeatNumber: '6F',
          createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          ItineraryID: 7,  // Itinerary of User 7
          FlightID: 1,
          Class: 'First Class',
          SeatNumber: '2B',
          createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          ItineraryID: 8,  // Itinerary of User 8
          FlightID: 2,
          Class: 'Economy',
          SeatNumber: '15A',
          createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          ItineraryID: 9,  // Itinerary of User 9
          FlightID: 1,    
          Class: 'Business',
          SeatNumber: '4C',
          createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          ItineraryID: 10, // Itinerary of User 10
          FlightID: 2,    
          Class: 'Economy',
          SeatNumber: '18E',
          createdAt: new Date(),
        updatedAt: new Date()
        },
      ]);
    },
  
    down: async (queryInterface) => {
      return queryInterface.bulkDelete('FlightItineraries', null, {});
    }
  };
  