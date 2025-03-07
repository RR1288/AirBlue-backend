'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_log', {
      ID: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      TableName: { type: Sequelize.STRING(255), allowNull: false },
      Operation: { type: Sequelize.STRING(10), allowNull: false},
      ChangedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false },
      ChangedBy: { type: Sequelize.STRING, defaultValue: false, allowNull: false },
      OldData: { type: Sequelize.JSONB, allowNull: false },
      NewData: { type: Sequelize.JSONB, allowNull: false }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('audit_log');
  }
};
