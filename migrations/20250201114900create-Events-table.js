'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      EventID: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      EventName: { type: Sequelize.STRING(50), allowNull: false },
      EventDescription: { type: Sequelize.STRING(200) },
      EventStartDate: {type: Sequelize.DATE, allowNull: false},
      EventEndDate: {type: Sequelize.DATE, allowNull: false},
      EventTotalBudget: { type: Sequelize.DECIMAL(14,2), defaultValue: 0 },
      ExpectedAttendees: { type: Sequelize.INTEGER, defaultValue: 0 },
      EventFlightBudget: { type: Sequelize.DECIMAL(14,2), defaultValue: 0 },
      FlightBudgetThreshold: { type: Sequelize.DECIMAL(6,2), defaultValue: 0.00}, //for now I am just doing this value in percent
      MaxAttendees: {type: Sequelize.INTEGER, allowNull: false},
      Location: {type: Sequelize.STRING(50), allowNull: false},
      TypeID: { type: Sequelize.BIGINT, references: { model: 'EventTypes', key: 'TypeID' }, allowNull: false },
      OrganizationID: { type: Sequelize.BIGINT, references: { model: 'Organizations', key: 'OrganizationID' }, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};
