module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define('Organization', {
      OrganizationID: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      OrganizationName: DataTypes.STRING(30),
      Description: DataTypes.STRING(500),
      IsActive: DataTypes.BOOLEAN,
      CreationDateTime: DataTypes.DATE,
      LastEdited: DataTypes.DATE,
      Owner: { type: DataTypes.BIGINT, references: { model: 'Users', key: 'UserID' }, unique: true }
    });
  
    Organization.belongsTo(models.User, { foreignKey: 'Owner' });
    Organization.hasMany(models.OrganizationEventType, { foreignKey: 'OrganizationID' });
    Organization.hasMany(models.UserOrganization, { foreignKey: 'OrganizationID' });
    Organization.hasMany(models.Event, { foreignKey: 'OrganizationID' });
  
    return Organization;
  };