"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("EventBudgetAuditLogs", {
            ID: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            UserID: { //editor
                type: Sequelize.BIGINT, 
                references: { model: 'Users', key: 'UserID' }, 
                allowNull: false },
            EventID: { 
                type: Sequelize.BIGINT, 
                references: { model: 'Events', key: 'EventID' }, 
                allowNull: false
            },
            ColumnName:{
                type: Sequelize.ENUM('EventTotalBudget', 'EventFlightBudget', 'FlightBudgetThreshold'),
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
            deletedAt: {
                type: Sequelize.DATE, // For paranoid mode
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable("EventBudgetAuditLogs");
    },
};
