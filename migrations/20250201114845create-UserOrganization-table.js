'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserOrganizations', {
      UserID: { 
        type: Sequelize.BIGINT, 
        references: { model: 'Users', key: 'UserID' }, 
        primaryKey: true, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      OrganizationID: { 
        type: Sequelize.BIGINT, 
        references: { model: 'Organizations', key: 'OrganizationID' }, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
      Roles: {type: Sequelize.STRING(3)}, //need to do fast research on how to restrict the values
      StillActive: { type: Sequelize.BOOLEAN },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserOrganizations');
  }
};
