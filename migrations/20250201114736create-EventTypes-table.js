'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EventTypes', {
      TypeID: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      OrganizationType: { type: Sequelize.BOOLEAN, defaultValue: false },
      DateCreated: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false},
      LastEdited: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EventTypes');
  }
};
