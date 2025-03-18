"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Segments", {
            SegmentID: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            SliceID: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "Slices",
                    key: "SliceID",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            OriginAirport: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            OriginCity: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            OriginIATA: {
                type: Sequelize.STRING(3),
                allowNull: false,
            },
            DestinationAirport: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            DestinationCity: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            DestinationIATA: {
                type: Sequelize.STRING(3),
                allowNull: false,
            },
            OriginTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            DestinationTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            Duration: {
                type: Sequelize.INTEGER, // in minutes
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            deletedAt: {
                type: Sequelize.DATE, // For paranoid mode
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable("Segments");
    },
};
