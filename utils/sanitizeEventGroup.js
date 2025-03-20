const validator = require("validator");
const {getEventGroup}= require("../controllers/eventController")
function startSanitizeString(input){
    if (typeof input !== 'string') return null;
    let sanitizedInput = input.trim();
    sanitizedInput = validator.escape(sanitizedInput);
    sanitizedInput = sanitizedInput.replace(/['";`]/g, '');
    sanitizedInput = validator.stripLow(sanitizedInput, true);
    return sanitizedInput;
}

function validateEventGroup(eventId, groupId){
    if (getEventGroup(parseInt(eventId), parseInt(groupId)) === null) return false;
    return true;
}

function sanitizeGroupFlightBudget(budget){
    if (typeof budget !== 'number') return null;
    //turning it to string to run through validation
    let strValue = String(budget).trim();

    //validation
    if(!validator.isFloat(strValue, { min: 0.00, max: 9999.99, locale: 'en-US'})) return null;

    let sanitizedBudget = parseFloat(strValue).toFixed(2);

    if (sanitizedBudget.length > 15) return null;

    return sanitizedBudget;
}

function sanitizeGroupName(name){
    let SanitizedName = startSanitizeString(name);
    //validation
    if (SanitizedName.length > 30) return null;
    return SanitizedName;
}

module.exports = {sanitizeGroupFlightBudget, sanitizeGroupName, validateEventGroup};