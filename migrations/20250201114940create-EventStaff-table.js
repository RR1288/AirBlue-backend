'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EventStaffs', {
      UserID: { type: Sequelize.BIGINT, references: { model: 'Users', key: 'UserID' }, primaryKey: true },
      EventID: { type: Sequelize.BIGINT, references: { model: 'Events', key: 'EventID' }, primaryKey: true },
      RoleID: { type: Sequelize.STRING(2), allowNull: false },
      DateAdded: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EventStaffs');
  }
};
