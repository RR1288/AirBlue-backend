module.exports = {
    up: async (queryInterface) => {
      return queryInterface.bulkInsert('UserFlightPreferences', [
        {
          UserID: 1,
          Type: 'Window Seat',
          Value: 'Yes',
          DateAdded: new Date(),
          LastEdited: new Date(),
        },
        {
          UserID: 2,
          Type: 'Meal Preference',
          Value: 'Vegetarian',
          DateAdded: new Date(),
          LastEdited: new Date(),
        }
      ]);
    },
    down: async (queryInterface) => {
      return queryInterface.bulkDelete('UserFlightPreferences', null, {});
    }
  };
  