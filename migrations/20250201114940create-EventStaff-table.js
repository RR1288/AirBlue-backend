'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EventStaffs', {
      UserID: { 
        type: Sequelize.BIGINT, 
        references: { model: 'Users', key: 'UserID' }, 
        primaryKey: true, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      EventID: { 
        type: Sequelize.BIGINT, 
        references: { model: 'Events', key: 'EventID' }, 
        primaryKey: true, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      RoleID: { type: Sequelize.STRING(2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EventStaffs');
  }
};
