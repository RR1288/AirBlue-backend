module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Organizations', [
      {
        OrganizationName: 'Tech Corp',
        Description: 'A leading technology company',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 1,
      },
      {
        OrganizationName: 'Health Inc',
        Description: 'A health and wellness company',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 2,
      },
      {
        OrganizationName: 'EduNet',
        Description: 'An education network focused on online learning',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 3,
      },
      {
        OrganizationName: 'Green Future',
        Description: 'A non-profit dedicated to environmental conservation',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 4,
      },
      {
        OrganizationName: 'Travel World',
        Description: 'A global travel agency offering exciting tours',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 5,
      },
      {
        OrganizationName: 'Finance Solutions',
        Description: 'A financial advisory firm helping clients grow wealth',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 6,
      },
      {
        OrganizationName: 'Design Studio',
        Description: 'A creative studio specializing in graphic design',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 7,
      },
      {
        OrganizationName: 'Digital Innovations',
        Description: 'A software development company with cutting-edge products',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 8,
      },
      {
        OrganizationName: 'Foodie Express',
        Description: 'A food delivery service with gourmet options',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 9,
      },
      {
        OrganizationName: 'Art Collective',
        Description: 'An organization promoting local artists and their works',
        IsActive: true,
        CreationDateTime: new Date(),
        LastEdited: new Date(),
        Owner: 10,
      }
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Organizations', null, {});
  }
};
