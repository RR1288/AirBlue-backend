module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        EventID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        EventName: DataTypes.STRING(50),
        EventDescription: DataTypes.STRING(200),
        EventTotalBudget: DataTypes.DECIMAL(14,2),
        EventStartDate: DataTypes.DATE,
        EventEndDate: DataTypes.DATE,
        ExpectedAttendees: DataTypes.INTEGER,
        EventFlightBudget: DataTypes.DECIMAL(14,2),
        FlightBudgetThreshold: DataTypes.DECIMAL(6,2),
        MaxAttendees:  DataTypes.INTEGER,
        Location:  DataTypes.STRING(50), 
        TypeID: {
            type: DataTypes.BIGINT,
            references: {model: "EventTypes", key: "TypeID"},
        },
        OrganizationID: {
            type: DataTypes.BIGINT,
            references: {model: "Organizations", key: "OrganizationID"},
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
    });

    Event.associate = function (models) {
        Event.belongsTo(models.EventType, {foreignKey: "TypeID"});
        Event.belongsTo(models.Organization, {foreignKey: "OrganizationID"});
        Event.hasMany(models.EventGroup, {foreignKey: "EventID"});
        Event.hasMany(models.Attendee, {foreignKey: "EventID"});
        Event.hasMany(models.Itinerary, {foreignKey: "EventID"});
        Event.hasMany(models.EventStaff, {foreignKey: "EventID"});
        Event.hasMany(models.EventBudgetAuditLog, {foreignKey: "EventID"});
    };

    return Event;
};
