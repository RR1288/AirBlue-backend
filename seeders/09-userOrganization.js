/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface) => {
        return queryInterface.bulkInsert("UserOrganizations", [
            {
                UserID: 1, // Replace with actual UserIDs
                OrganizationID: 1, // Replace with actual OrganizationIDs
                Roles: "AEF", // Event Planner, Administrator, Finance
                updatedAt: new Date(),
                createdAt: new Date(),
                StillActive: true,
            },
            {
                UserID: 2,
                OrganizationID: 1,
                Roles: "EF", // Event Planner, Finance
                updatedAt: new Date(),
                createdAt: new Date(),
                StillActive: true,
            },
            {
                UserID: 3,
                OrganizationID: 2,
                Roles: "F", // Finance
                updatedAt: new Date(),
                createdAt: new Date(),
                StillActive: true,
            },
            {
                UserID: 4,
                OrganizationID: 1,
                Roles: "F", // Finance
                updatedAt: new Date(),
                createdAt: new Date(),
                StillActive: true,
            },
            {
                UserID: 5,
                OrganizationID: 2,
                Roles: "EF", // Event Planner, Finance
                updatedAt: new Date(),
                createdAt: new Date(),
                StillActive: true,
            },
        ]);
    },

    down: async (queryInterface) => {
        return queryInterface.bulkDelete("UserOrganizations", null, {});
    },
};
