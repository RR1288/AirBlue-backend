module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("Segments", [
      {
        SliceID: 1, // NYC -> SFO
        OriginAirport: "John F. Kennedy International Airport",
        OriginCity: "New York",
        OriginIATA: "JFK",
        DestinationAirport: "San Francisco International Airport",
        DestinationCity: "San Francisco",
        DestinationIATA: "SFO",
        OriginTime: new Date("2025-03-20T08:00:00Z"),
        DestinationTime: new Date("2025-03-20T14:00:00Z"),
        Duration: 360, // 6 hours
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        SliceID: 2, // LAX -> AUS
        OriginAirport: "Los Angeles International Airport",
        OriginCity: "Los Angeles",
        OriginIATA: "LAX",
        DestinationAirport: "Austin-Bergstrom International Airport",
        DestinationCity: "Austin",
        DestinationIATA: "AUS",
        OriginTime: new Date("2025-04-05T10:30:00Z"),
        DestinationTime: new Date("2025-04-05T13:30:00Z"),
        Duration: 180, // 3 hours
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        SliceID: 3, // ORD -> DEN
        OriginAirport: "Chicago O'Hare International Airport",
        OriginCity: "Chicago",
        OriginIATA: "ORD",
        DestinationAirport: "Denver International Airport",
        DestinationCity: "Denver",
        DestinationIATA: "DEN",
        OriginTime: new Date("2025-05-10T07:00:00Z"),
        DestinationTime: new Date("2025-05-10T09:30:00Z"),
        Duration: 150, // 2.5 hours
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        SliceID: 4, // SEA -> MIA
        OriginAirport: "Seattle-Tacoma International Airport",
        OriginCity: "Seattle",
        OriginIATA: "SEA",
        DestinationAirport: "Miami International Airport",
        DestinationCity: "Miami",
        DestinationIATA: "MIA",
        OriginTime: new Date("2025-06-15T06:00:00Z"),
        DestinationTime: new Date("2025-06-15T12:00:00Z"),
        Duration: 360, // 6 hours
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: async (queryInterface) => {
    return queryInterface.bulkDelete("Segments", null, {});
  }
};
