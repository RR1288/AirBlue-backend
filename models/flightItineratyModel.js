module.exports = (sequelize, DataTypes) => {
  const FlightItinerary = sequelize.define('FlightItinerary', {
    ItineraryID: { 
      type: DataTypes.BIGINT, 
      references: { model: 'Itineraries', key: 'ItineraryID' }, 
      primaryKey: true 
    },
    FlightID: { 
      type: DataTypes.BIGINT, 
      references: { model: 'Flights', key: 'FlightID' }, 
      primaryKey: true 
    },
    Class: DataTypes.STRING(25),
    SeatNumber: DataTypes.STRING(5),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  },{
    sequelize,
    paranoid: true
});

  FlightItinerary.associate = function(models) {
    FlightItinerary.belongsTo(models.Itinerary, { foreignKey: 'ItineraryID' });
    FlightItinerary.belongsTo(models.Flight, { foreignKey: 'FlightID' });
  };

  return FlightItinerary;
};
