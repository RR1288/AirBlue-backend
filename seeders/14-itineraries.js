module.exports = {
    up: async (queryInterface) => {
      return queryInterface.bulkInsert('Itineraries', [
        {
          UserID: 1,  // John Doe
          Bags: 2,
          Cost: 500.00,
          Approved: true,
          DateApproved: new Date(),
          Active: true,
          LastUpdate: new Date(),
        },
        {
          UserID: 2,  // Jane Doe
          Bags: 1,
          Cost: 350.00,
          Approved: false,
          DateApproved: null,
          Active: false,
          LastUpdate: new Date(),
        },
        {
          UserID: 3,  // User 3
          Bags: 3,
          Cost: 700.00,
          Approved: true,
          DateApproved: new Date(),
          Active: true,
          LastUpdate: new Date(),
        },
        {
          UserID: 4,  // User 4
          Bags: 1,
          Cost: 400.00,
          Approved: false,
          DateApproved: null,
          Active: false,
          LastUpdate: new Date(),
        },
        {
          UserID: 5,  // User 5
          Bags: 2,
          Cost: 600.00,
          Approved: true,
          DateApproved: new Date(),
          Active: true,
          LastUpdate: new Date(),
        },
        {
          UserID: 6,  // User 6
          Bags: 1,
          Cost: 300.00,
          Approved: false,
          DateApproved: null,
          Active: false,
          LastUpdate: new Date(),
        },
        {
          UserID: 7,  // User 7
          Bags: 4,
          Cost: 900.00,
          Approved: true,
          DateApproved: new Date(),
          Active: true,
          LastUpdate: new Date(),
        },
        {
          UserID: 8,  // User 8
          Bags: 2,
          Cost: 550.00,
          Approved: false,
          DateApproved: null,
          Active: false,
          LastUpdate: new Date(),
        },
        {
          UserID: 9,  // User 9
          Bags: 3,
          Cost: 750.00,
          Approved: true,
          DateApproved: new Date(),
          Active: true,
          LastUpdate: new Date(),
        },
        {
          UserID: 10, // User 10
          Bags: 1,
          Cost: 350.00,
          Approved: false,
          DateApproved: null,
          Active: false,
          LastUpdate: new Date(),
        },
      ]);
    },
  
    down: async (queryInterface) => {
      return queryInterface.bulkDelete('Itineraries', null, {});
    }
  };
  