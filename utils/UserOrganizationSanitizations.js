const validator = require("validator");
function startSanitize(input) {
    if (typeof input !== 'string') return null;
    let sanitizedInput = input.trim();
    sanitizedInput = validator.escape(sanitizedInput);
    sanitizedInput = sanitizedInput.replace(/['";`]/g, '');
    sanitizedInput = validator.stripLow(sanitizedInput, true);
    return sanitizedInput;
}

function sanitizeRoles(roles) {
    let sanitizedRoles = startSanitize(roles);
    if(sanitizeRoles === null) return sanitizedRoles;

    const rolesRegex = /^[EFA]{1,3}$/;
    //validation
    if(!rolesRegex.test(sanitizedRoles)){
        return null;
    }
    return sanitizedRoles;
}

module.exports = {
    sanitizeRoles
}