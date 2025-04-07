

module.exports = (sequelize, DataTypes) => {
    const EventBudgetAuditLog = sequelize.define("EventBudgetAuditLog", {
        ID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.BIGINT,
            references: {model: "Users", key: "UserID"},
        },
        EventID: {
            type: DataTypes.BIGINT,
            references: {model: "Events", key: "EventID"},
        },
        ColumnName:{
            type: DataTypes.ENUM('EventTotalBudget', 'EventFlightBudget', 'FlightBudgetThreshold'),
        },
        CurrentValue: {
            type: DataTypes.DECIMAL(14,2), 
        },
        PreviousValue: {
            type: DataTypes.DECIMAL(14,2), 
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
    });

    EventBudgetAuditLog.associate = function (models) {
        EventBudgetAuditLog.belongsTo(models.User, {foreignKey: "UserID"});
        EventBudgetAuditLog.belongsTo(models.Event, {foreignKey: "EventID"});
    };

    return EventBudgetAuditLog;
};