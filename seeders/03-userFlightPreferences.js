module.exports = {
    up: async (queryInterface) => {
      return queryInterface.bulkInsert('UserFlightPreferences', [
        {
          UserID: 1,
          Type: 'Window Seat',
          Value: 'Yes',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          UserID: 2,
          Type: 'Meal Preference',
          Value: 'Vegetarian',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    },
    down: async (queryInterface) => {
      return queryInterface.bulkDelete('UserFlightPreferences', null, {});
    }
  };
  