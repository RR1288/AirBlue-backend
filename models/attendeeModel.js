module.exports = (sequelize, DataTypes) => {
    const Attendee = sequelize.define("Attendee", {
        UserID: {
            type: DataTypes.BIGINT,
            references: {model: "Users", key: "UserID"},
            primaryKey: true,
        },
        EventID: {
            type: DataTypes.BIGINT,
            references: {model: "Events", key: "EventID"},
            primaryKey: true,
        },
        EventGroupID: {
            type: DataTypes.BIGINT,
            references: {model: "EventGroups", key: "EventGroupID"},
        },
        DateAdded: DataTypes.DATE,
        Confirmed: DataTypes.BOOLEAN,
    },
    {
        Sequelize,
        paranoid: true,
    });

    Attendee.associate = function (models) {
        Attendee.belongsTo(models.User, {foreignKey: "UserID"});
        Attendee.belongsTo(models.Event, {foreignKey: "EventID"});
        Attendee.belongsTo(models.EventGroup, {foreignKey: "EventGroupID"});
    };

    return Attendee;
};
