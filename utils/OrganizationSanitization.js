const validator = require("validator");
const { getOrganization } = require("../controllers/organizationControllor");
//universal starting point
function startSanitizeString(input){
    if (typeof input !== 'string') return null;
    let sanitizedInput = input.trim();
    sanitizedInput = validator.escape(sanitizedInput);
    sanitizedInput = sanitizedInput.replace(/['";`]/g, '');
    sanitizedInput = validator.stripLow(sanitizedInput, true);
    return sanitizedInput;
}

//function only returns true and false since its role is to make sure that the organization exists
function validateOrganizationID(organizationID){
    if (typeof organizationID !== 'integer') return false;
    if (getOrganization(organizationID) === null) return false;
    
    return true
}

module.exports = {}