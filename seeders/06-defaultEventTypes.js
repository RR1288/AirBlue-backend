module.exports = {
    up: async (queryInterface) => {
        return queryInterface.bulkInsert('DefaultEventTypes', [
            {
                TypeID: 1,
                Name: 'Conference',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                TypeID: 2,
                Name: 'Workshop',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    down: async (queryInterface) => {
        return queryInterface.bulkDelete('DefaultEventTypes', null, {});
    }
};
