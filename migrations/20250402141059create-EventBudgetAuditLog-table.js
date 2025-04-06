"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("EventBudgetAuditLog", {
            
            
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
