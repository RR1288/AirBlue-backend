'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Flights', {
      FlightID: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      FlightNumber: { type: Sequelize.STRING(6), allowNull: false },
      DepartureAirport: { type: Sequelize.STRING(50), allowNull: false },
      ArrivalAirport: { type: Sequelize.STRING(50), allowNull: false },
      ArrivalDateTime: { type: Sequelize.DATE, allowNull: false },
      DepartureDateTime: { type: Sequelize.DATE, allowNull: false },
      Airline: { type: Sequelize.STRING(30), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: { type: Sequelize.DATE }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Flights');
  }
};
