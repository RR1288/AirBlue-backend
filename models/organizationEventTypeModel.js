module.exports = (sequelize, DataTypes) => {
    const OrganizationEventType = sequelize.define('OrganizationEventType', {
      TypeID: { type: DataTypes.BIGINT, references: { model: 'EventTypes', key: 'TypeID' }, primaryKey: true },
      Name: DataTypes.STRING(25),
      OrganizationID: { type: DataTypes.BIGINT, references: { model: 'Organizations', key: 'OrganizationID' } }
    });
  
    OrganizationEventType.belongsTo(models.EventType, { foreignKey: 'TypeID' });
    OrganizationEventType.belongsTo(models.Organization, { foreignKey: 'OrganizationID' });
  
    return OrganizationEventType;
  };
  