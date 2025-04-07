'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Attendees', {
      AttendeeID: { type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true, },
      UserID: { 
        type: Sequelize.BIGINT, 
        references: { model: 'Users', key: 'UserID' }, allowNull: false 
      },
      EventID: { 
        type: Sequelize.BIGINT, 
        references: { model: 'Events', key: 'EventID' }, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false 
      },
      EventGroupID: { type: Sequelize.BIGINT, references: { model: 'EventGroups', key: 'EventGroupID' }, allowNull: false },
      Confirmed: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Attendees');
  }
};
