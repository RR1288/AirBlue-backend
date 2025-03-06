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
        DateRemoved: DataTypes.DATE,
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

    UserOrganization.associate = (models) => {
        UserOrganization.belongsTo(models.User, {foreignKey: "UserID"});
        UserOrganization.belongsTo(models.Organization, {
            foreignKey: "OrganizationID",
        });
    };

    return UserOrganization;
};
