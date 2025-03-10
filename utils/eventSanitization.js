const validator = require("validator");
const { validateOrganizationID } = require("./OrganizationSanitization");

function startSanitizeString(input){
    if (typeof input !== 'string') return null;
    let sanitizedInput = input.trim();
    sanitizedInput = validator.escape(sanitizedInput);
    sanitizedInput = sanitizedInput.replace(/['";`]/g, '');
    sanitizedInput = validator.stripLow(sanitizedInput, true);
    return sanitizedInput;
}

function sanitizeEventName(name){
    sanitizedName = startSanitizeString(name);
    //validation
    if (santizedName.length > 50 ) return null;
    return santizedName;
}

function sanitizeEventDescription(description){
    sanitizedDescription = startSanitizeString(description);
    //validation
    if (sanitizedDescription.length > 200) return null;
    return sanitizedDescription;
}

function sanitizeDate(date){
    if (typeof date !== 'string') return null;
    let sanitizedDate = input.trim();
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

module.exports = {sanitizeDate, sanitizeEventName, sanitizeEventDescription, sanitizeFlightBudget, sanitizeTotalBudget}