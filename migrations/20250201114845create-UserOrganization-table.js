'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserOrganizations', {
      UserID: { type: Sequelize.BIGINT, references: { model: 'Users', key: 'UserID' }, primaryKey: true },
      OrganizationID: { type: Sequelize.BIGINT, references: { model: 'Organizations', key: 'OrganizationID' } },
      Roles: {type: Sequelize.STRING(3)}, //need to do fast research on how to restrict the values
      DateGiven: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE },
      StillActive: { type: Sequelize.BOOLEAN },
      DateRemoved: { type: Sequelize.DATE },
      deletedAt: {type: Sequelize.DATE} ,
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: { type: Sequelize.DATE }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserOrganizations');
  }
};
