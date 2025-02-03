module.exports = (sequelize, DataTypes) => {
    const EventType = sequelize.define('EventType', {
      TypeID: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      OrganizationType: DataTypes.BOOLEAN,
      DateCreated: DataTypes.DATE,
      LastEdited: DataTypes.DATE
    });
  
    EventType.hasMany(models.DefaultEventType, { foreignKey: 'TypeID' });
    EventType.hasMany(models.OrganizationEventType, { foreignKey: 'TypeID' });
    EventType.hasMany(models.Event, { foreignKey: 'TypeID' });
  
    return EventType;
  };