/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface) => {
        return queryInterface.bulkInsert('OrganizationEventTypes', [
            {
                TypeID: 1,
                Name: 'Conference',
                OrganizationID: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                TypeID: 2,
                Name: 'Workshop',
                OrganizationID: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                TypeID: 3,
                Name: 'Pitch',
                OrganizationID: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                TypeID: 4,
                Name: 'Retreat',
                OrganizationID: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                TypeID: 5,
                Name: 'Gala',
                OrganizationID: 5,
                createdAt: new Date(),
                updatedAt: new Date()
            },

        ]);
    },

    down: async (queryInterface) => {
        return queryInterface.bulkDelete('OrganizationEventTypes', null, {});
    }
};
