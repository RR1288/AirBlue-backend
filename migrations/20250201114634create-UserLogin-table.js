/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserLogins', {
      UserID: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: 'Users', key: 'UserID' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: true,
      },
      Password: { type: Sequelize.CHAR(128), allowNull: false },
      MFATarget: { type: Sequelize.STRING(14), allowNull: true }, // Changed to allowNull:true to match model
      LastPasswordChange: { type: Sequelize.DATE, allowNull: true },
      LastMFAChange: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: true },
      two_fa_enabled: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
      two_fa_secret: { type: Sequelize.CHAR(32), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
<<<<<<< HEAD
<<<<<<< HEAD
      deletedAt: {type: Sequelize.DATE}
=======
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
>>>>>>> staging
=======
      deletedAt: {type: Sequelize.DATE , defaultValue: null}
>>>>>>> AIRBLUE-53-Create-users-backend
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserLogins');
  },
};
