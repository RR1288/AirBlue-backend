module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
      EventID: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      EventName: DataTypes.STRING(50),
      EventDescription: DataTypes.STRING(200),
      EventTotalBudget: DataTypes.INTEGER,
      ExpectedAttendees: DataTypes.INTEGER,
      EventFlightBudget: DataTypes.INTEGER,
      TypeID: { type: DataTypes.BIGINT, references: { model: 'EventTypes', key: 'TypeID' } },
      OrganizationID: { type: DataTypes.BIGINT, references: { model: 'Organizations', key: 'OrganizationID' } },
      DateCreated: DataTypes.DATE,
      LastEdited: DataTypes.DATE
    });
  
    Event.belongsTo(models.EventType, { foreignKey: 'TypeID' });
    Event.belongsTo(models.Organization, { foreignKey: 'OrganizationID' });
    Event.hasMany(models.EventGroup, { foreignKey: 'EventID' });
    Event.hasMany(models.Attendee, { foreignKey: 'EventID' });
    Event.hasMany(models.EventStaff, { foreignKey: 'EventID' });
  
    return Event;
  };