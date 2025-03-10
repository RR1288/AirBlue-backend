const { sendSuccess, sendError } = require("../utils/responseHelpers");
const { registerUserFull, registerBasic, setOrganization, updateUser } = require("../controllers/userController");
const { User } = require("../models/userModel");
const { sanitizeEmail, sanitizeName, sanitizeCountry, sanitizeState, sanitizeCity, sanitizePassword, sanitizeKTN } = require("../utils/UserSanitizations"); //have to change the file name since right now it does both sanitization and validation
const { validateOrganizationID } = require("../utils/OrganizationSanitization");
const { sanitizeRoles } = require("../utils/UserOrganizationSanitizations");
const jwt = require('jsonwebtoken');
//user registration
exports.registerUserEndUser = async (req, res) => {
    try {
        let { password, fname, lname, city, state, country, email } =
            req.body;
        // Validate that all attributes exist
        if (!password || !fname || !lname || !country || !email) {
            return sendError(res, "Arguments missing", 401); //TODO: Check status code
        }
        //sanitizing and validating all fields
        email = sanitizeEmail(email);
        if (email === null) return sendError(res, "Invalid input for email", 400);
        fname = sanitizeName(fname);
        if (fname === null) return sendError(res, "Invalid input for first name", 400);
        lname = sanitizeName(lname);
        if (lname === null) return sendError(res, "Invalid input for last name", 400);
        country = sanitizeCountry(country);
        if (country === null) return sendError(res, "Invalid input for country", 400);
        password = sanitizePassword(password);
        if (password === null) return sendError(res, "Invalid input for password", 400);

        if (!city) {
            city = null;
        } else {
            city = sanitizeCity(city);
            if (city === null) return sendError(res, "Invalid input for city");//TODO: make more helpful message and check error code
        }

        if (!state) {
            state = null;
        } else {
            state = sanitizeState(state);
            if (state === null) return sendError(res, "Invalid input State");//TODO: make more helpful message and check error code
        }
        
        const registeredUser = await registerUserFull(email, password, fname, lname, city, state, country);
        if (!registeredUser || !registeredUser.userId) {
            return sendError(res, "Could not register this user", 404);
        }
        return sendSuccess(res, "User registered successfully");
    } catch (error) {
        console.error(error);
        return sendError(
            res,
            "Something went wrong while registering user"
        );
    }
};

exports.registerUserCSV = async (req, res) => {
    try {
        let { fname, lname, country, email } =
            req.body;
        // Validate that all attributes exist
        if (!fname || !lname || !country || !email) {
            return sendError(res, "Arguments missing", 401); //TODO: Check status code
        }
        //sanitizing and validating all fields
        email = sanitizeEmail(email);
        if (email === null) return sendError(res, "Invalid input for email", 400);//TODO:  check error code
        fname = sanitizeName(fname);
        if (fname === null) return sendError(res, "Invalid input for first name", 400);//TODO:  check error code
        lname = sanitizeName(lname);
        if (lname === null) return sendError(res, "Invalid input for last name", 400);//TODO:  check error code
        country = sanitizeCountry(country);
        if (country === null) return sendError(res, "Invalid input for country", 400);//TODO:  check error code

        const registeredUser = await registerBasic(email, fname, lname, country);
        if (!registeredUser || !registeredUser.userId) {
            return sendError(res, "Could not register this user", 404);
        }
        return sendSuccess(res, "User registered successfully");
    } catch (error) {
        console.error(error);
        return sendError(
            res,
            "Something went wrong while registering user"
        );
    }
};

exports.registerUserOrganization = async (req, res) => {
    try {
        let { fname, lname, password, city, country, state, email, organizationID, roles } = req.body;
        // Validate that all attributes exist
        if (!fname || !lname || !country || !email || !organizationID || !roles) {
            return sendError(res, "Arguments missing", 401); //TODO: Check status code
        }
        //sanitizing and validating all fields
        email = sanitizeEmail(email);
        email = sanitizeEmail(email);
        if (email === null) return sendError(res, "Invalid input for email", 400);
        fname = sanitizeName(fname);
        if (fname === null) return sendError(res, "Invalid input for first name", 400);
        lname = sanitizeName(lname);
        if (lname === null) return sendError(res, "Invalid input for last name", 400);
        country = sanitizeCountry(country);
        if (country === null) {
            return sendError(res, "Invalid input for country", 400);
        }
        password = sanitizePassword(password);
        if (password === null) { 
            return sendError(res, "Invalid input for password", 400);
        }
        if (!validateOrganizationID(organizationID)) {
            return sendError(res, "Invalid input for organization", 400);
        }
        roles = sanitizeRoles(roles);
        if (roles === null){
            return sendError(res, "Invalid input for roles", 400);
        }
        if (!city) {
            city = null;
        } else {
            city = sanitizeCity(city);
            if (city === null) return sendError(res, "Invalid input for city");//TODO: make more helpful message and check error code
        }

        if (!state) {
            state = null;
        } else {
            state = sanitizeState(state);
            if (state === null) return sendError(res, "Invalid input State");//TODO: make more helpful message and check error code
        }
        
        const registeredUser = await registerUserFull(email, password, fname, lname, city, state, country);
        if (!registeredUser || !registeredUser.userId) {
            return sendError(res, "Could not register this user", 404);
        }
        //add user to organization
        OrganizationUserSuccess = setOrganization(roles, organizationID, registeredUser.userId);
        if (!OrganizationUserSuccess) {
            return sendError(res, "Could not register this user in the organization", 404);
        }

        return sendSuccess(res, "User registered successfully to organization", {
            registeredUser,
        });

    } catch (error) {
        console.error(error);
        return sendError(
            res,
            "Something went wrong while registering user"
        );
    }
};


//user updates
exports.updateUserInfo = async (req, res) =>{
    try {
        let {fname, lname, city, state, country, ktn} = req.body;
        //getting UserId
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let userID = parseInt(decoded.id);
        // sanitizations and validations
        fname = sanitizeName(fname);
        if (fname === null) return sendError(res, "Invalid input for first name", 400);
        lname = sanitizeName(lname);
        if (lname === null) return sendError(res, "Invalid input for last name", 400);
        country = sanitizeCountry(country);
        if (country === null) return sendError(res, "Invalid input for country", 400);
        city = sanitizeCity(city);
        if (city === null) return sendError(res, "Invalid input for city", 400);
        state = sanitizeState(state);
        if (state === null) return sendError(res, "Invalid input State", 400);
        ktn = sanitizePassword(ktn);
        if (ktn === null) return sendError(res, "Invalid input ktn", 400);

        const succesull = await updateUser(userID, fname, lname, city, state, country, ktn);
        if (!succesull) return sendError(res, 'update failed', 404);

        return sendSuccess(res, "User was successfully updated");
    } catch (err) {
        console.error(err);
        return sendError(
            res,
            "Something went wrong while registering user"
        );
    }
    
}