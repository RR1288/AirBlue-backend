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
        Cost: DataTypes.DECIMAL,
        Approved: DataTypes.BOOLEAN,
        DateApproved: DataTypes.DATE,
        Active: DataTypes.BOOLEAN,
        LastUpdate: DataTypes.DATE,
    });

    Itinerary.associate = function (models) {
        Itinerary.belongsTo(models.User, {foreignKey: "UserID"});
    };

    return Itinerary;
};
