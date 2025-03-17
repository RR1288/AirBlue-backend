"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Organizations", {
            OrganizationID: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            OrganizationName: {type: Sequelize.STRING(30), allowNull: false},
            Description: {type: Sequelize.STRING(500), defaultValue: ""},
            IsActive: {type: Sequelize.BOOLEAN, defaultValue: true},
            Owner: {
                type: Sequelize.BIGINT,
                references: {model: "Users", key: "UserID"},
                unique: true,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            deletedAt: {type: Sequelize.DATE, defaultValue: null},
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Organizations");
    },
};
