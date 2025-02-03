module.exports = {
    up: async (queryInterface) => {
        return queryInterface.bulkInsert('DefaultEventTypes', [
            {
                TypeID: 1,
                Name: 'Conference',
            },
            {
                TypeID: 2,
                Name: 'Workshop',
            }
        ]);
    },
    down: async (queryInterface) => {
        return queryInterface.bulkDelete('DefaultEventTypes', null, {});
    }
};
