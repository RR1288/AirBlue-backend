"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Users", {
            UserID: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            UserName: { type: Sequelize.STRING(320), allowNull: false, unique: true},
            FName: { type: Sequelize.STRING(50), allowNull: false },
            LName: { type: Sequelize.STRING(50), allowNull: false },
            City: { type: Sequelize.STRING(85) },
            State: { type: Sequelize.CHAR(2) },
            Country: { type: Sequelize.STRING(56), allowNull: false },
            Email: { type: Sequelize.STRING(320), unique: true, allowNull: false },
            KTN: { type: Sequelize.STRING(10), unique: true },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            deletedAt: {type: Sequelize.DATE , defaultValue: null}
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
      },
  }