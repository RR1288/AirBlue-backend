"use strict";
module.exports = (sequelize, DataTypes) => {
    const Segment = sequelize.define(
        "Segment",
        {
            SegmentID: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            SliceID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Slices",
                    key: "SliceID",
                },
            },
            OriginAirport: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            OriginCity: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            OriginIATA: {
                type: DataTypes.STRING(3),
                allowNull: false,
            },
            DestinationAirport: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            DestinationCity: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            DestinationIATA: {
                type: DataTypes.STRING(3),
                allowNull: false,
            },
            OriginTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            DestinationTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            Duration: {
                type: DataTypes.INTEGER, // in minutes
                allowNull: false,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            paranoid: true,
        }
    );

    Segment.associate = function (models) {
        Segment.belongsTo(models.Slice, {
            foreignKey: "SliceID",
        });
    };

    return Segment;
};
