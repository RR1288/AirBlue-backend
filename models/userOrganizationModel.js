module.exports = (sequelize, DataTypes) => {
    const UserOrganization = sequelize.define('UserOrganization', {
      UserID: { type: DataTypes.BIGINT, references: { model: 'Users', key: 'UserID' }, primaryKey: true },
      OrganizationID: { type: DataTypes.BIGINT, references: { model: 'Organizations', key: 'OrganizationID' } },
      DateGiven: DataTypes.DATE,
      LastUpdated: DataTypes.DATE,
      StillActive: DataTypes.BOOLEAN,
      DateRemoved: DataTypes.DATE
    });
  
    UserOrganization.belongsTo(models.User, { foreignKey: 'UserID' });
    UserOrganization.belongsTo(models.Organization, { foreignKey: 'OrganizationID' });
  
    return UserOrganization;
  };