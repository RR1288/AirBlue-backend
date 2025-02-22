module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        EventID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        EventName: DataTypes.STRING(50),
        EventDescription: DataTypes.STRING(200),
        EventTotalBudget: DataTypes.DECIMAL(12,2),
        ExpectedAttendees: DataTypes.INTEGER,
        EventFlightBudget: DataTypes.DECIMAL(12,2),
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
        Event.hasMany(models.EventStaff, {foreignKey: "EventID"});
    };

    return Event;
};
