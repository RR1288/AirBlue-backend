'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Itineraries', {
      ItineraryID: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      UserID: { type: Sequelize.BIGINT, references: { model: 'Users', key: 'UserID' }, allowNull: false },
      Bags: { type: Sequelize.INTEGER, defaultValue: 1 },
      Cost: { type: Sequelize.DECIMAL, allowNull: false },
      Approved: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
      DateApproved: {type: Sequelize.DATE },
      Active: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
      LastUpdate: {type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Itineraries');
  }
};
