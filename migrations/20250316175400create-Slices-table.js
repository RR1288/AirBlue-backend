"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Slices", {
      SliceID: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      ItineraryID: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Itineraries",
          key: "ItineraryID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      OriginAirport: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      OriginCity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      OriginIATA: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      DestinationAirport: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      DestinationCity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      DestinationIATA: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      Duration: {
        type: Sequelize.INTEGER, // in minutes
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE, // For paranoid mode
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Slices");
  },
};
