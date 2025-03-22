module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('EventStaffs', [
      {
        UserID: 1,  // John Doe
        EventID: 1,
        RoleID: 'E', // Admin + Event planner
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 1,  // John Doe
        EventID: 6,
        RoleID: 'E', // Admin + Event planner
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 2,  // Jane Doe
        EventID: 1,
        RoleID: 'EF', // Event planner + Finance
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 3,  // User 3
        EventID: 2,
        RoleID: 'E',  // Event Planner
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 4,  // User 4
        EventID: 2,
        RoleID: 'F',  // Finance
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 5,  // User 5
        EventID: 3,
        RoleID: 'FE', // finance + Event planner
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 6,  // User 6
        EventID: 3,
        RoleID: 'E',  // Event Planner
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 7,  // User 7
        EventID: 4,
        RoleID: 'EF', // Event planner + Finance
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 8,  // User 8
        EventID: 4,
        RoleID: 'F',  // Finance
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 9,  // User 9
        EventID: 5,
        RoleID: 'E',  // Event Planner
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserID: 10, // User 10
        EventID: 5,
        RoleID: 'F', // Finance
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('EventStaffs', null, {});
  }
};
