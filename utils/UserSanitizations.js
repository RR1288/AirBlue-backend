const validator = require("validator");

//universal starting point
function startSanitize(input){
    if (typeof input !== 'string') return null;
    let sanitizedInput = input.trim();
    sanitizedInput = validator.escape(sanitizedInput);
    sanitizedInput = sanitizedInput.replace(/['";`]/g, '');
    sanitizedInput = validator.stripLow(sanitizedInput, true);
    return sanitizedInput;
}

//username
/*function sanitizeUsername (uname){
    let sanitizedUsername = startSanitize(uname);


}*/
//email
function sanitizeEmail(email){
    let sanitizedEmail = startSanitize(email);
    if (sanitizedEmail === '' || sanitizedEmail === null) return null;
    if (!sanitizedEmail.includes("@")) return null;

    sanitizedEmail = validator.normalizeEmail(sanitizedEmail, { gmail_remove_dots: false});

    //validation
    if (!validator.isEmail(sanitizedEmail)) return null;

    return sanitizedEmail;
}
//Name
//this function will santize both the firstname and lastname
function sanitizeName(name){
    //sanitization
    let sanitizedName = startSanitize(name);
    if (sanitizedName === '') return null;

    //validation
    const nameRegex = /^[a-zA-Z\s\-]/;
    if (!nameRegex.test(sanitizedName)) return null;

    return sanitizedName;
}
//password
function sanitizePassword(password){
    //santiize
    let sanitizedPassword = startSanitize(password);
    if (sanitizedPassword === '') return null;

    const passwordRegex = /^[a-zA-Z!@#$%^&*]/;
    //validation
    if (!passwordRegex.test(password)) return null;

    return sanitizedPassword;
}
//ktn
function sanitizeKTN(ktn){
    //sanitization
    let sanitizedKTN = startSanitize(ktn);
    if (sanitizedKTN === '') return null;

    //validation
    if (!validator.isAlphanumeric(sanitizedKTN) ) return null;
    if (sanitizedKTN.length < 9 || sanitizedKTN.length > 10) return null; //checks length
    if (['TT','TE','AC'].includes(sanitizedKTN.substring(0,2))) return null; //checks the prefix
    
    return sanitizedKTN;
}
//country
function sanitizeCountry(country){
    //sanitization
    let sanitizedCountry = startSanitize(country);
    if (sanitizedCountry== '') return null;

    //validation
    if(!validator.isAlpha(sanitizedCountry)) return null;

    return sanitizedCountry;
}
//city
function sanitizeCity(city){
    //sanitization
    let sanitizedCity = startSanitize(city);
    if (sanitizedCity == '') return null;

    //validation
    if(!validator.isAlpha(sanitizedCity)) return null;
}
//state
function sanitizeState(state){
    //sanitization
    let sanitizedState = startSanitize(state);
    if (sanitizedState == '') return null;

    //validation
    if (sanitizedState.length !== 2) return null;
    if (!validator.isAlpha(sanitizedState)) return null;
    // TODO add an option that actually checks if it is a state
    return sanitizedState;
}

module.exports = {
    sanitizeCountry,
    sanitizeCity,
    sanitizeEmail,
    sanitizePassword,
    sanitizeState,
    sanitizeKTN,
    sanitizeName
}
