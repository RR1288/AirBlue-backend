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
        Confirmed: DataTypes.BOOLEAN,
<<<<<<< HEAD
<<<<<<< HEAD
    },
    {
        Sequelize,
        paranoid: true,
=======
=======
>>>>>>> AIRBLUE-53-Create-users-backend
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
<<<<<<< HEAD
>>>>>>> staging
=======
>>>>>>> AIRBLUE-53-Create-users-backend
    });

    Attendee.associate = function (models) {
        Attendee.belongsTo(models.User, {foreignKey: "UserID"});
        Attendee.belongsTo(models.Event, {foreignKey: "EventID"});
        Attendee.belongsTo(models.EventGroup, {foreignKey: "EventGroupID"});
    };

    return Attendee;
};
