'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserFlightPreferences', {
      PreferenceID: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      UserID: { type: Sequelize.BIGINT, references: { model: 'Users', key: 'UserID' }, allowNull: false },
      Type: { type: Sequelize.STRING(16), allowNull: false },
      Value: { type: Sequelize.STRING(50), allowNull: false },
<<<<<<< HEAD
<<<<<<< HEAD
      DateAdded: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false },
      LastEdited: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false },
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
    await queryInterface.dropTable('UserFlightPreferences');
  }
};
