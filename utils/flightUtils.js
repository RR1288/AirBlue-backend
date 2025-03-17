const validIATACode = (code) => /^[A-Z]{3}$/.test(code);
const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

const validateFlightParams = ({ origin, destination, departureDate, returnDate, cabinClass }) => {
  if (!origin || !destination || !departureDate || !returnDate) {
    throw { status: 400, message: "Missing required query parameters: origin, destination, departureDate, and returnDate" };
  }

  if (!validIATACode(origin) || !validIATACode(destination)) {
    throw { status: 400, message: "Invalid IATA airport code format (must be 3 uppercase letters)" };
  }

  if (!isValidDate(departureDate) || !isValidDate(returnDate)) {
    throw { status: 400, message: "Invalid departure date format (must be YYYY-MM-DD)" };
  }

  const today = new Date().toISOString().split("T")[0];
  if (departureDate < today || returnDate < today) {
    throw { status: 400, message: "Dates cannot be in the past" };
  }
  
  if (returnDate < departureDate) {
    // TODO: might be able to just swap dates
    throw { status: 400, message: "Return date cannot be before departure date" };
  }

  const validCabinClasses = ["economy", "premium_economy", "business", "first"];
  if (cabinClass && !validCabinClasses.includes(cabinClass)) {
    throw { status: 400, message: `Invalid cabin class. Must be one of: ${validCabinClasses.join(", ")}` };
  }
};

const parseDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  const hours = match[1] ? parseInt(match[1].replace("H", ""), 10) : 0;
  const minutes = match[2] ? parseInt(match[2].replace("M", ""), 10) : 0;
  return hours * 60 + minutes; // Convert to total minutes
};
module.exports = { validateFlightParams, parseDuration };
