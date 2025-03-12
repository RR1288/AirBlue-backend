module.exports = (sequelize, DataTypes) => {
    const Invitation = sequelize.define(
      "Invitation",
      {
        InvitationID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        invitedEmail: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { isEmail: true },
        },
        EventID: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        UserID: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        EventGroupID: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("pending", "accepted", "declined"),
          allowNull: false,
          defaultValue: "pending",
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: true, // You can set an expiration date for the invitation
        },
        token: {
          type: DataTypes.STRING,
          allowNull: true, // Token for invitation link generation
        },
      }
    );
  
    Invitation.associate = (models) => {
      Invitation.belongsTo(models.Event, { foreignKey: "EventID", as: "event" });
      Invitation.belongsTo(models.User, { foreignKey: "UserID", as: "user" });
      Invitation.belongsTo(models.EventGroup, { foreignKey: "EventGroupID", as: "eventGroup" });
    };
  
    return Invitation;
  };
  