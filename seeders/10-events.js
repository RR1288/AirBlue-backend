module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Events', [
      {
        EventName: 'Tech Conference 2025',
        EventDescription: 'A large technology conference showcasing the latest innovations in the tech industry.',
        EventStartDate: new Date('2025-04-15T09:00:00Z'),
        EventEndDate: new Date('2025-04-17T17:00:00Z'),
        EventTotalBudget: 500000.00,
        ExpectedAttendees: 5000,
        EventFlightBudget: 100000.00,
        MaxAttendees:  200,
        FlightBudgetThreshold: 0.00,
        Location: 'rochester NY',
        
        TypeID: 1,
        OrganizationID: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        EventName: 'Annual Music Festival',
        EventDescription: 'An exciting weekend of live music featuring top artists from various genres.',
        EventStartDate: new Date('2025-06-10T18:00:00Z'),
        EventEndDate: new Date('2025-06-12T23:59:59Z'),
        EventTotalBudget: 200000.00,
        ExpectedAttendees: 10000,
        EventFlightBudget: 50000.00,
        MaxAttendees:  200000,
        FlightBudgetThreshold: 0.20,
        Location: 'rochester NY',
        TypeID: 2,
        OrganizationID: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        EventName: 'Startup Pitch Event',
        EventDescription: 'A pitch event where startups present their innovative ideas to investors.',
        EventStartDate: new Date('2025-03-20T10:00:00Z'),
        EventEndDate: new Date('2025-03-20T17:00:00Z'),
        EventTotalBudget: 150000.00,
        ExpectedAttendees: 300,
        EventFlightBudget: 30000.00,
        FlightBudgetThreshold: 0.10,
        MaxAttendees:  300,
        Location: 'rochester NY',
        TypeID: 3,
        OrganizationID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        EventName: 'Corporate Retreat 2025',
        EventDescription: 'A retreat focused on team building and strategy planning for the year ahead.',
        EventStartDate: new Date('2025-05-01T09:00:00Z'),
        EventEndDate: new Date('2025-05-03T17:00:00Z'),
        EventTotalBudget: 100000.00,
        ExpectedAttendees: 200,
        EventFlightBudget: 20000.00,
        FlightBudgetThreshold: 0.15,
        MaxAttendees:  200,
        Location: 'rochester NY',
        TypeID: 4,
        OrganizationID: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        EventName: 'Charity Gala 2025',
        EventDescription: 'A glamorous charity gala to raise funds for a noble cause.',
        EventStartDate: new Date('2025-07-10T18:00:00Z'),
        EventEndDate: new Date('2025-07-10T23:59:59Z'),
        EventTotalBudget: 250000.00,
        ExpectedAttendees: 1000,
        EventFlightBudget: 40000.00,
        MaxAttendees:  2000,
        Location: 'rochester NY',
        TypeID: 5,
        OrganizationID: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        EventName: 'Charity Gala 2025',
        EventDescription: 'A glamorous charity gala to raise funds for a noble cause.',
        EventStartDate: new Date('2025-07-10T18:00:00Z'),
        EventEndDate: new Date('2025-07-10T23:59:59Z'),
        EventTotalBudget: 250000.00,
        ExpectedAttendees: 1000,
        EventFlightBudget: 40000.00,
        FlightBudgetThreshold: 1.00,
        MaxAttendees:  2000,
        Location: 'rochester NY',
        TypeID: 5,
        OrganizationID: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Events', null, {});
  }
};
