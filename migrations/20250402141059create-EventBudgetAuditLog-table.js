"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("EventBudgetAuditLog", {
            ID: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            EventID: { type: Sequelize.BIGINT, references: { model: 'Events', key: 'EventID' }, allowNull: false },
            ColumnName: {
                type: Sequelize.ENUM('EventTotalBudget','EventFlightBudget','FlightBudgetThreshold'),
                allowNull: false
            },
            CurrentValue: {
                type: Sequelize.DECIMAL(14,2), 
                defaultValue: 0
            },
            PreviousValue: {
                type: Sequelize.DECIMAL(14,2), 
                defaultValue: 0
            },
            Editor: {
                type: Sequelize.BIGINT, 
                references: { model: 'Users', key: 'UserID' }, 
                allowNull: false
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
