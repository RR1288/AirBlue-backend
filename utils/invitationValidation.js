const validator = require("validator");

function validateToken(token){
    if (typeof token !== 'string') return false;
    if(token.isAlphaNumeric(token)) return false;

    return true;
}

module.exports = {validateToken};