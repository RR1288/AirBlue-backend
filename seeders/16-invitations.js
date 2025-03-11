'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Invitations', [
      {
        invitedEmail: 'john.doe@example.com',
        EventID: 1,
        UserID: null, // User not registered yet
        status: 'pending',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // Expires in 48 hours
        token: 'sampletoken1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invitedEmail: 'jane.doe@example.com',
        EventID: 1,
        UserID: 2, // Existing user
        status: 'accepted',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        token: 'sampletoken2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invitedEmail: 'mark.smith@example.com',
        EventID: 2,
        UserID: null,
        status: 'pending',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        token: 'sampletoken3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Invitations', null, {});
  },
};
