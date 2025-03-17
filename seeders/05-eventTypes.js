module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('EventTypes', [
      {
        OrganizationType: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ,
      {
        OrganizationType: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ,
      {
        OrganizationType: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ,
      {
        OrganizationType: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ,
      {
        OrganizationType: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ,
      {
        OrganizationType: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ,
      {
        OrganizationType: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface) => {
    return queryInterface.bulkDelete('EventTypes', null, {});
  }
};
