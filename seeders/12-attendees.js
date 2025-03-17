module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Attendees', [
      {
        UserID: 1,
        EventID: 1,
        EventGroupID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Confirmed: true,
      },
      {
        UserID: 2,
        EventID: 2,
        EventGroupID: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        Confirmed: false,
      },
      {
        UserID: 3,
        EventID: 1,
        EventGroupID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Confirmed: true,
      },
      {
        UserID: 4,
        EventID: 3,
        EventGroupID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Confirmed: false,
      },
    ]);
  },
  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Attendees', null, {});
  }
};
