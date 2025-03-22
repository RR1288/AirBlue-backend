// models/userLogin.js
module.exports = (sequelize, DataTypes) => {
    const UserLogin = sequelize.define('UserLogin', {
      UserID: { type: DataTypes.BIGINT, primaryKey: true, references: { model: 'Users', key: 'UserID' }, unique: true },
      Password: DataTypes.CHAR(128),
      MFATarget: DataTypes.STRING(14),
      LastPasswordChange: DataTypes.DATE,
      LastMFAChange: DataTypes.DATE,
      two_fa_enabled: DataTypes.BOOLEAN,
      two_fa_secret: DataTypes.CHAR(32),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
      token: {
        type: DataTypes.STRING,
        allowNull: true, // Token for invitation link generation
      },
    },{
      sequelize,
      paranoid: true
  });
  
    UserLogin.associate = (models) => {
      UserLogin.belongsTo(models.User, { foreignKey: 'UserID' });
    };
  
    return UserLogin;
  };