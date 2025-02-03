module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('EventTypes', [
      {
        OrganizationType: true,
        DateCreated: new Date(),
        LastEdited: new Date(),
      }
      ,
      {
        OrganizationType: false,
        DateCreated: new Date(),
        LastEdited: new Date(),
      }
      ,
      {
        OrganizationType: false,
        DateCreated: new Date(),
        LastEdited: new Date(),
      }
      ,
      {
        OrganizationType: false,
        DateCreated: new Date(),
        LastEdited: new Date(),
      }
      ,
      {
        OrganizationType: true,
        DateCreated: new Date(),
        LastEdited: new Date(),
      }
    ]);
  },
  down: async (queryInterface) => {
    return queryInterface.bulkDelete('EventTypes', null, {});
  }
};
