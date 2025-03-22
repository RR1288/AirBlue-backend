module.exports = (sequelize, DataTypes) => {
    const Itinerary = sequelize.define(
        "Itinerary",
        {
            ItineraryID: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            AttendeeID: {
                type: DataTypes.BIGINT,
                references: {model: "Attendees", key: "AttendeeID"},
            },


            DuffelOrderID: DataTypes.STRING(30),
            DuffelPassID: DataTypes.STRING(30),
            DuffelOfferID: DataTypes.STRING(30),

            BookingReference: DataTypes.STRING(6),
            TotalCost: DataTypes.DECIMAL(4, 2),
            BaseCost: DataTypes.DECIMAL(4, 2),
            TaxCost: DataTypes.DECIMAL(4, 2),

            ApprovalStatus: DataTypes.ENUM(
                "pending",
                "denied",
                "approved",
                "expired"
            ),

            heldAt: DataTypes.DATE, // User selects an offer
            cancelledAt: DataTypes.DATE, // Planner denies flight
            approvedAt: DataTypes.DATE, // Planner approves and pays the order
            expiresAt: DataTypes.DATE, // If order is still on hold

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            paranoid: true,
        }
    );

    Itinerary.associate = function (models) {
        Itinerary.belongsTo(models.Attendee, {foreignKey: "AttendeeID"});
    };

    return Itinerary;
};
