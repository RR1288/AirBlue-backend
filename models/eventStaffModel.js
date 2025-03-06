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
        // RoleID: {
        //     type: DataTypes.BIGINT,
        //     references: {model: "Roles", key: "RoleID"},
        // },
<<<<<<< HEAD
        DateAdded: DataTypes.DATE,
    },
    {
      Sequelize,
      paranoid: true,
=======
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
>>>>>>> staging
    });

    EventStaff.associate = function (models) {
        EventStaff.belongsTo(models.User, {foreignKey: "UserID"});
        EventStaff.belongsTo(models.Event, {foreignKey: "EventID"});
        //EventStaff.belongsTo(models.Role, {foreignKey: "RoleID"});
    };

    return EventStaff;
};
