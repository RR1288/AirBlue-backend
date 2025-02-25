module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('EventGroups', [
      {
        EventID: 1,
        Name: 'VIP Group',
        FlightBudget: 5000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        EventID: 2,
        Name: 'General Group',
        FlightBudget: 350.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface) => {
    return queryInterface.bulkDelete('EventGroups', null, {});
  }
};
