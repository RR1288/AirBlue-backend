module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("Slices", [
      {
        ItineraryID: 1, // John Doe - Tech Conference 2025
        OriginAirport: "John F. Kennedy International Airport",
        OriginCity: "New York",
        OriginIATA: "JFK",
        DestinationAirport: "San Francisco International Airport",
        DestinationCity: "San Francisco",
        DestinationIATA: "SFO",
        Duration: 360, // 6 hours
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ItineraryID: 2, // Jane Doe - Annual Music Festival
        OriginAirport: "Los Angeles International Airport",
        OriginCity: "Los Angeles",
        OriginIATA: "LAX",
        DestinationAirport: "Austin-Bergstrom International Airport",
        DestinationCity: "Austin",
        DestinationIATA: "AUS",
        Duration: 180, // 3 hours
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ItineraryID: 3, // Startup Pitch Event
        OriginAirport: "Chicago O'Hare International Airport",
        OriginCity: "Chicago",
        OriginIATA: "ORD",
        DestinationAirport: "Denver International Airport",
        DestinationCity: "Denver",
        DestinationIATA: "DEN",
        Duration: 150, // 2.5 hours
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ItineraryID: 4, // Corporate Retreat 2025
        OriginAirport: "Seattle-Tacoma International Airport",
        OriginCity: "Seattle",
        OriginIATA: "SEA",
        DestinationAirport: "Miami International Airport",
        DestinationCity: "Miami",
        DestinationIATA: "MIA",
        Duration: 360, // 6 hours
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: async (queryInterface) => {
    return queryInterface.bulkDelete("Slices", null, {});
  }
};
