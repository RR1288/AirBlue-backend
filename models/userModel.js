module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    UserName: DataTypes.STRING(320),
    FName: DataTypes.STRING(50),
    LName: DataTypes.STRING(50),
    City: DataTypes.STRING(85),
    State: DataTypes.CHAR(2),
    Country: DataTypes.STRING(56),
    Email: { type: DataTypes.STRING(320), unique: true },
    KTN: DataTypes.STRING(10),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  },{
    sequelize,
    paranoid: true
});

  User.associate = (models) => {
    User.hasOne(models.UserLogin, { foreignKey: 'UserID' });
    User.hasMany(models.UserFlightPreference, { foreignKey: 'UserID' });
    User.hasMany(models.UserOrganization, { foreignKey: 'UserID' });
    User.hasMany(models.Attendee, { foreignKey: 'UserID' });
    User.hasMany(models.EventStaff, { foreignKey: 'UserID' });
    User.hasMany(models.EventBudgetAuditLog, { foreignKey: 'UserID' });
  };

  return User;
};
