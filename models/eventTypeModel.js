module.exports = (sequelize, DataTypes) => {
    const EventType = sequelize.define("EventType", {
        TypeID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        OrganizationType: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
    });

    EventType.associate = function (models) {
        EventType.hasMany(models.DefaultEventType, {foreignKey: "TypeID"});
        EventType.hasMany(models.OrganizationEventType, {foreignKey: "TypeID"});
        EventType.hasMany(models.Event, {foreignKey: "TypeID"});
    };

    return EventType;
};
