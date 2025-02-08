module.exports = {
    up: async (queryInterface) => {
      return queryInterface.bulkInsert('Attendees', [
        {
          UserID: 1,
          EventID: 1,
          EventGroupID: 1,
          DateAdded: new Date(),
          Confirmed: true,
        },
        {
          UserID: 2,
          EventID: 2,
          EventGroupID: 2,
          DateAdded: new Date(),
          Confirmed: false,
        }
      ]);
    },
    down: async (queryInterface) => {
      return queryInterface.bulkDelete('Attendees', null, {});
    }
  };
  