/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface) => {
        return queryInterface.bulkInsert('OrganizationEventTypes', [
            {
                TypeID: 1,
                Name: 'Conference',
                OrganizationID: 1,
            },
            {
                TypeID: 2,
                Name: 'Workshop',
                OrganizationID: 2,
            },

            {
                TypeID: 3,
                Name: 'Pitch',
                OrganizationID: 3,
            },
            {
                TypeID: 4,
                Name: 'Retreat',
                OrganizationID: 4,
            },
            {
                TypeID: 5,
                Name: 'Gala',
                OrganizationID: 5,
            },

        ]);
    },

    down: async (queryInterface) => {
        return queryInterface.bulkDelete('OrganizationEventTypes', null, {});
    }
};
