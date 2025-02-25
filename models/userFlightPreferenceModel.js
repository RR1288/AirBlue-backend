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
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
    });

    UserFlightPreference.associate = (models) => {
        UserFlightPreference.belongsTo(models.User, {foreignKey: "UserID"});
    };

    return UserFlightPreference;
};
