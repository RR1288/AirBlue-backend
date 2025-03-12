module.exports = (sequelize, DataTypes) => {
    const EventStaff = sequelize.define("EventStaff", {
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
        RoleID: {
            type: DataTypes.STRING(2),
         },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
    });

    EventStaff.associate = function (models) {
        EventStaff.belongsTo(models.User, {foreignKey: "UserID"});
        EventStaff.belongsTo(models.Event, {foreignKey: "EventID"});
        //EventStaff.belongsTo(models.Role, {foreignKey: "RoleID"});
    };

    return EventStaff;
};
