'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Itineraries', {
      ItineraryID: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      UserID: { type: Sequelize.BIGINT, references: { model: 'Users', key: 'UserID' }, allowNull: false },
      Bags: { type: Sequelize.INTEGER, defaultValue: 1 },
      Cost: { type: Sequelize.DECIMAL(6,2), allowNull: false },
      ApprovalStatus: { type: Sequelize.ENUM('not submitted', 'pending', 'denied','approved'), defaultValue: 'not submitted', allowNull: false },
      DateApproved: {type: Sequelize.DATE },
      Active: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
<<<<<<< HEAD
<<<<<<< HEAD
      LastUpdate: {type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false },
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
    await queryInterface.dropTable('Itineraries');
  }
};
