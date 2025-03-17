module.exports = (sequelize, DataTypes) => {
    const Slice = sequelize.define(
        "Slice",
        {
            SliceID: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            ItineraryID: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: "Itineraries",
                    key: "ItineraryID",
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
            paranoid: true, // Enables soft delete
            tableName: "Slices"
        }
    );

    Slice.associate = function (models) {
        Slice.belongsTo(models.Itinerary, {foreignKey: "ItineraryID"});
        Slice.hasMany(models.Segment, {foreignKey: "SliceID"});
    };

    return Slice;
};
