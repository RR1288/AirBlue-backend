'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Attendees', {
      UserID: { type: Sequelize.BIGINT, references: { model: 'Users', key: 'UserID' }, primaryKey: true },
      EventID: { type: Sequelize.BIGINT, references: { model: 'Events', key: 'EventID' }, primaryKey: true },
      EventGroupID: { type: Sequelize.BIGINT, references: { model: 'EventGroups', key: 'EventGroupID' }, allowNull: false },
<<<<<<< HEAD
<<<<<<< HEAD
      DateAdded: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false },
      Confirmed: { type: Sequelize.BOOLEAN, defaultValue: false },
      deletedAt: {type: Sequelize.DATE}
=======
=======
>>>>>>> AIRBLUE-53-Create-users-backend
      Confirmed: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
<<<<<<< HEAD
>>>>>>> staging
=======
>>>>>>> AIRBLUE-53-Create-users-backend
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Attendees');
  }
};
