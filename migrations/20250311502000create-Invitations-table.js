"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Invitations", {
            InvitationID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            invitedEmail: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            EventID: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            UserID: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },
            EventGroupID: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM("pending", "accepted", "declined"),
                allowNull: false,
                defaultValue: "pending",
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deletedAt: {type: Sequelize.DATE, defaultValue: null},
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Invitations");
    },
};
