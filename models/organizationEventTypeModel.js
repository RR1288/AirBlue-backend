module.exports = (sequelize, DataTypes) => {
    const OrganizationEventType = sequelize.define("OrganizationEventType", {
        TypeID: {
            type: DataTypes.BIGINT,
            references: {model: "EventTypes", key: "TypeID"},
            primaryKey: true,
        },
        Name: DataTypes.STRING(25),
        OrganizationID: {
            type: DataTypes.BIGINT,
            references: {model: "Organizations", key: "OrganizationID"},
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    });

    OrganizationEventType.belongsTo(models.EventType, {foreignKey: "TypeID"});
    OrganizationEventType.belongsTo(models.Organization, {
        foreignKey: "OrganizationID",
    });

    return OrganizationEventType;
};
module.exports = (sequelize, DataTypes) => {
    const OrganizationEventType = sequelize.define("OrganizationEventType", {
        TypeID: {
            type: DataTypes.BIGINT,
            references: {model: "EventTypes", key: "TypeID"},
            primaryKey: true,
        },
        Name: DataTypes.STRING(25),
        OrganizationID: {
            type: DataTypes.BIGINT,
            references: {model: "Organizations", key: "OrganizationID"},
        },
    },{
        sequelize,
        paranoid: true
    });

    OrganizationEventType.associate = function (models) {
        OrganizationEventType.belongsTo(models.EventType, {
            foreignKey: "TypeID",
        });
        OrganizationEventType.belongsTo(models.Organization, {
            foreignKey: "OrganizationID",
        });
    };

    return OrganizationEventType;
};
