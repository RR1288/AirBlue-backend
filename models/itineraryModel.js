module.exports = (sequelize, DataTypes) => {
    const Itinerary = sequelize.define("Itinerary", {
        ItineraryID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.BIGINT,
            references: {model: "Users", key: "UserID"},
        },
        Bags: DataTypes.INTEGER,
        Cost: DataTypes.DECIMAL(4,2),
        ApprovalStatus: DataTypes.ENUM('not submitted', 'pending', 'denied','approved'),
        DateApproved: DataTypes.DATE,
        Active: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
    });

    Itinerary.associate = function (models) {
        Itinerary.belongsTo(models.User, {foreignKey: "UserID"});
    };

    return Itinerary;
};
