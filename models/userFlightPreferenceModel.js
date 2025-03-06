module.exports = (sequelize, DataTypes) => {
    const UserFlightPreference = sequelize.define("UserFlightPreference", {
        PreferenceID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.BIGINT,
            references: {model: "Users", key: "UserID"},
        },
        Type: DataTypes.STRING(16),
        Value: DataTypes.STRING(50),
<<<<<<< HEAD
<<<<<<< HEAD
        DateAdded: DataTypes.DATE,
        LastEdited: DataTypes.DATE,
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

    UserFlightPreference.associate = (models) => {
        UserFlightPreference.belongsTo(models.User, {foreignKey: "UserID"});
    };

    return UserFlightPreference;
};
