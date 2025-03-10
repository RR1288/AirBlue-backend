const validator = require("validator");
const {getEventTypes} = require("../controllers/eventController");

function startSanitize(input) {
    if (typeof input !== 'string') return null;
    let sanitizedInput = input.trim();
    sanitizedInput = validator.escape(sanitizedInput);
    sanitizedInput = sanitizedInput.replace(/['";`]/g, '');
    sanitizedInput = validator.stripLow(sanitizedInput, true);
    return sanitizedInput;
}

//this function makes sure that an event type exists in the list of Total eventTypes available to the user in their organization
function validateEventType(typeID, organizationID){
    //get the list of eventTypes
    const eventTypes = getEventTypes(organizationID); //may need to make this function async
    return eventTypes.some(event => event.TypeID === typeID);
}

function sanitizeTypeName(name){
    let sanitizedName = startSanitize(name);
    //validation
    if (sanitizedName === null) return null;
    if (sanitizedName.length > 25) return null;
    return sanitizedName;
}

module.exports = {sanitizeTypeName, validateEventType}