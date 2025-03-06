module.exports = (sequelize, DataTypes) => {
    const UserOrganization = sequelize.define("UserOrganization", {
        UserID: {
            type: DataTypes.BIGINT,
            references: {model: "Users", key: "UserID"},
            primaryKey: true,
        },
        OrganizationID: {
            type: DataTypes.BIGINT,
            references: {model: "Organizations", key: "OrganizationID"},
        },
        Roles: DataTypes.STRING(3),
        StillActive: DataTypes.BOOLEAN,
<<<<<<< HEAD
<<<<<<< HEAD
        DateRemoved: DataTypes.DATE,
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

    UserOrganization.associate = (models) => {
        UserOrganization.belongsTo(models.User, {foreignKey: "UserID"});
        UserOrganization.belongsTo(models.Organization, {
            foreignKey: "OrganizationID",
        });
    };

    return UserOrganization;
};
