'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FlightItineraries', {
      ItineraryID: { type: Sequelize.BIGINT, references: { model: 'Itineraries', key: 'ItineraryID' }, primaryKey: true },
      FlightID: { type: Sequelize.BIGINT, references: { model: 'Flights', key: 'FlightID' }, primaryKey: true },
      Class: { type: Sequelize.STRING(25), allowNull: false },
      SeatNumber: { type: Sequelize.STRING(5), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FlightItineraries');
  }
};
