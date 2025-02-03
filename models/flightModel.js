module.exports = (sequelize, DataTypes) => {
    const Flight = sequelize.define('Flight', {
      FlightID: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      FlightNumber: DataTypes.STRING(6),
      DepartureAirport: DataTypes.STRING(50),
      ArrivalAirport: DataTypes.STRING(50),
      ArrivalDateTime: DataTypes.DATE,
      DepartureDateTime: DataTypes.DATE,
      Airline: DataTypes.STRING(30)
    });
  
    return Flight;
  };