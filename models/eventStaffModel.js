module.exports = (sequelize, DataTypes) => {
    const EventStaff = sequelize.define('EventStaff', {
      UserID: { type: DataTypes.BIGINT, references: { model: 'Users', key: 'UserID' }, primaryKey: true },
      EventID: { type: DataTypes.BIGINT, references: { model: 'Events', key: 'EventID' }, primaryKey: true },
      RoleID: { type: DataTypes.BIGINT, references: { model: 'Roles', key: 'RoleID' } },
      DateAdded: DataTypes.DATE
    });
  
    EventStaff.belongsTo(models.User, { foreignKey: 'UserID' });
    EventStaff.belongsTo(models.Event, { foreignKey: 'EventID' });
  
    return EventStaff;
  };