module.exports = (sequelize, DataTypes) => {
    const DefaultEventType = sequelize.define("DefaultEventType", {
        TypeID: {
            type: DataTypes.BIGINT,
            references: {model: "EventTypes", key: "TypeID"},
            primaryKey: true,
        },
        Name: DataTypes.STRING(25),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },{
        sequelize,
        paranoid: true
    });

    DefaultEventType.associate = function (models) {
        DefaultEventType.belongsTo(models.EventType, {foreignKey: "TypeID"});
    };

    return DefaultEventType;
};
