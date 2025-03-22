module.exports = (sequelize, DataTypes) => {
    const EventGroup = sequelize.define("EventGroup", {
        EventGroupID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        EventID: {
            type: DataTypes.BIGINT,
            references: {model: "Events", key: "EventID"},
        },
        Name: DataTypes.STRING(30),
        FlightBudget: DataTypes.DECIMAL(6,2),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
    });

    // Define associations inside the associate method
    EventGroup.associate = function (models) {
        EventGroup.belongsTo(models.Event, {foreignKey: "EventID"});
    };

    return EventGroup;
};
