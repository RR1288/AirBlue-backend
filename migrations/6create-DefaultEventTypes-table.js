'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DefaultEventTypes', {
      TypeID: { type: Sequelize.BIGINT, references: { model: 'EventTypes', key: 'TypeID' }, primaryKey: true },
      Name: { type: Sequelize.STRING(25), allowNull: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DefaultEventTypes');
  }
};
