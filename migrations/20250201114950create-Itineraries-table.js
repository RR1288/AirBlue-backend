'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Itineraries', {

      ItineraryID: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      AttendeeID: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Attendees',
          key: 'AttendeeID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      EventID: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'EventID'
        }
      },

      DuffelOrderID: { type: Sequelize.STRING(30), allowNull: false },
      DuffelPassID: { type: Sequelize.STRING(30), allowNull: false },
      DuffelOfferID: { type: Sequelize.STRING(30), allowNull: false },

      BookingReference: { type: Sequelize.STRING(6) },
      TotalCost: { type: Sequelize.DECIMAL(6, 2), allowNull: false },
      BaseCost: { type: Sequelize.DECIMAL(6, 2), allowNull: false },
      TaxCost: { type: Sequelize.DECIMAL(6, 2), allowNull: false },
      ThresholdOnBook: { type: Sequelize.DECIMAL(6,2), allowNull: false },
      BudgetOnBook: { type: Sequelize.DECIMAL(6,2), allowNull: false },
      GroupName: { type: Sequelize.STRING(30), allowNull: false },
      ApprovalStatus: { type: Sequelize.ENUM('pending', 'denied', 'approved', 'expired'), allowNull: false },

      heldAt: { type: Sequelize.DATE, defaultValue: null },     // User selects an offer
      cancelledAt: { type: Sequelize.DATE, defaultValue: null }, // Planner denies flight
      approvedAt: { type: Sequelize.DATE, defaultValue: null }, // Planner approves and pays the order
      expiresAt: { type: Sequelize.DATE, defaultValue: null },  // If order is still on hold

      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: { type: Sequelize.DATE, defaultValue: null }
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Itineraries');
  }
};
