module.exports = {
    up: async (queryInterface) => {
      return queryInterface.bulkInsert('EventGroups', [
        {
          EventID: 1,
          Name: 'VIP Group',
          FlightBudget: 5000,
        },
        {
          EventID: 2,
          Name: 'General Group',
          FlightBudget: 3000,
        }
      ]);
    },
    down: async (queryInterface) => {
      return queryInterface.bulkDelete('EventGroups', null, {});
    }
  };
  