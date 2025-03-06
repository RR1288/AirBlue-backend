'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EventStaffs', {
      UserID: { type: Sequelize.BIGINT, references: { model: 'Users', key: 'UserID' }, primaryKey: true },
      EventID: { type: Sequelize.BIGINT, references: { model: 'Events', key: 'EventID' }, primaryKey: true },
      RoleID: { type: Sequelize.STRING(2), allowNull: false },
<<<<<<< HEAD
<<<<<<< HEAD
      DateAdded: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE}
=======
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
>>>>>>> staging
=======
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
>>>>>>> AIRBLUE-53-Create-users-backend
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EventStaffs');
  }
};
