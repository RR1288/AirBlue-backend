const validator = require("validator");
const { validateOrganizationID } = require("./OrganizationSanitization");
const{getEventByID} = require("../controllers/eventController");
const { start } = require("repl");

function startSanitizeString(input){
    if (typeof input !== 'string') return null;
    let sanitizedInput = input.trim();
    sanitizedInput = validator.escape(sanitizedInput);
    sanitizedInput = sanitizedInput.replace(/['";`]/g, '');
    sanitizedInput = validator.stripLow(sanitizedInput, true);
    return sanitizedInput;
}

async function  validateEventID(eventID){
    //calls a fucntion to get an event cooresponing to the ID if the call returns empty or erros out then it is not a valid eventID
    try{
        let events = await getEventByID(eventID);
    if (!events) {return false;}
    return true;
    }catch(error){
        return false;
    }
}

function sanitizeLocation(location) {
    let sanitizedLocation = startSanitizeString(location);
    if (sanitizeLocation === null) return null;
    return sanitizedLocation;
}

function sanitizeEventName(name){
    let sanitizedName = startSanitizeString(name);
    if (sanitizedName === null) return null;
    //validation
    if (sanitizedName.length > 50 ) return null;
    return sanitizedName;
}

function sanitizeEventDescription(description){
    let sanitizedDescription = startSanitizeString(description);
    if (sanitizedDescription === null) return null;
    //validation
    if (sanitizedDescription.length > 200) return null;
    return sanitizedDescription;
}

function sanitizeDate(date){
    if (typeof date !== 'string') return null;
    let sanitizedDate = date.trim();
    //validation
    if (!validator.isDate(sanitizedDate, {format: 'YYYY-MM-DD', strictMode: true})) return null;
    return sanitizedDate;
}

function sanitizeTotalBudget(budget){
    if (typeof budget !== 'number') return null;
    //turning it to string to run through validation
    let strValue = String(budget).trim();

    //validation
    if(!validator.isFloat(strValue, { min: 0.00, max: 999999999999.99, locale: 'en-US'})) return null;

    let sanitizedBudget = parseFloat(strValue).toFixed(2);

    if (sanitizedBudget.length > 17) return null;

    return sanitizedBudget;
}

function sanitizeFlightBudget(budget){
    if (typeof budget !== 'number') return null;
    //turning it to string to run through validation
    let strValue = String(budget).trim();

    //validation
    if(!validator.isFloat(strValue, { min: 0.00, max: 9999999999.99, locale: 'en-US'})) return null;

    let sanitizedBudget = parseFloat(strValue).toFixed(2);

    if (sanitizedBudget.length > 15) return null;

    return sanitizedBudget;
}
function sanitizeThresholdValuePercent(thresholdVal){
    if (typeof thresholdVal !== 'number') return null;
    //turning it to string to run through validation
    let strValue = String(thresholdVal).trim();
    //validation
    if(!validator.isFloat(strValue, { min: 0.00, max: 9.99, locale: 'en-US'})) return null;

    let sanitizedThresholdVal = parseFloat(strValue).toFixed(2);

    if (sanitizedThresholdVal.length > 4) return null;

    return sanitizedThresholdVal;
}

module.exports = {sanitizeDate, sanitizeEventName, sanitizeEventDescription, sanitizeFlightBudget, sanitizeTotalBudget, validateEventID, sanitizeLocation, sanitizeThresholdValuePercent}