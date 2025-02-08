/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface) => {
      return queryInterface.bulkInsert('UserOrganizations', [
        {
          UserID: 1, // Replace with actual UserIDs
          OrganizationID: 1, // Replace with actual OrganizationIDs
          Roles: 'AEF', // Event Planner, Administrator, Finance
          DateGiven: new Date(),
          LastUpdated: new Date(),
          StillActive: true,
          DateRemoved: null,
        },
        {
          UserID: 2,
          OrganizationID: 1,
          Roles: 'AE', // Event Planner, Administrator
          DateGiven: new Date(),
          LastUpdated: new Date(),
          StillActive: true,
          DateRemoved: null,
        },
        {
          UserID: 3,
          OrganizationID: 2,
          Roles: 'F', // Finance
          DateGiven: new Date(),
          LastUpdated: new Date(),
          StillActive: true,
          DateRemoved: null,
        },
        {
          UserID: 4,
          OrganizationID: 1,
          Roles: 'A', // Administrator
          DateGiven: new Date(),
          LastUpdated: new Date(),
          StillActive: true,
          DateRemoved: null,
        },
        {
          UserID: 5,
          OrganizationID: 2,
          Roles: 'EF', // Event Planner, Finance
          DateGiven: new Date(),
          LastUpdated: new Date(),
          StillActive: true,
          DateRemoved: null,
        }
      ]);
    },
  
    down: async (queryInterface) => {
      return queryInterface.bulkDelete('UserOrganizations', null, {});
    }
  };
  