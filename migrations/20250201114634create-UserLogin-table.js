'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserLogins', {
      UserID: { type: Sequelize.BIGINT, primaryKey: true, references: { model: 'Users', key: 'UserID' }, unique: true },
      Password: { type: Sequelize.CHAR(128), allowNull: false },
      MFATarget: { type: Sequelize.STRING(14), allowNull: false, },
      LastPasswordChange: { type: Sequelize.DATE, allowNull: false, },
      LastMFAChange: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserLogins');
  }
};
