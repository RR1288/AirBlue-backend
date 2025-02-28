const { sendSuccess, sendError } = require("../utils/responseHelpers");
const { registerUserFull, registerUserBasic } = require("../controllers/userController");
const { User } = require("../models/userModel");
const { sanitizeEmail, sanitizeName, sanitizeCountry, sanitizeCity, sanitizePassword } = require("../utils/UserSanitizations"); //have to change the file name since right now it does both sanitization and validation
const { validateOrganizationID } = require("../utils/OrganizationSanitization")
exports.registerUserEndUser = async (req, res) => {
    try {
        const { password, fname, lname, city, state, country, email } =
            req.body;
        // Validate that all attributes exist
        if (!password || !fname || !lname || !country || !email) {
            return sendError(res, "Arguments missing", 401); //TODO: Check status code
        }
        //sanitizing and validating all fields
        email = sanitizeEmail(email);
        if (email === null) return sendError(res, "Invalid input for email");//TODO:  check error code
        fname = sanitizeName(fname);
        if (fname === null) return sendError(res, "Invalid input for first name");//TODO:  check error code
        lname = sanitizeName(lname);
        if (lname === null) return sendError(res, "Invalid input for last name");//TODO:  check error code
        country = sanitizeCountry(country);
        if (country === null) return sendError(res, "Invalid input for country");//TODO:  check error code
        password = sanitizePassword(password);
        if (country === null) return sendError(res, "Invalid input for country");//TODO:  check error code

        if (!city) {
        } else {
            city = sanitizeCity(city);
            if (city === null) return sendError(res, "Invalid input for city");//TODO: make more helpful message and check error code
        }

        if (!state) {
        } else {
            state = sanitizeState(state);
            if (state === null) return sendError(res, "Invalid input State");//TODO: make more helpful message and check error code
        }

        const registeredUser = await registerUserFull();
        if (!registeredUser || !registeredUser.UserID) {
            return sendError(res, "Could not register this user", 404);
        }
        return sendSuccess(res, "User registered successfully", {
            registerUser,
        });
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
        const { fname, lname, country, email } =
            req.body;
        // Validate that all attributes exist
        if ( !fname || !lname || !country || !email) {
            return sendError(res, "Arguments missing", 401); //TODO: Check status code
        }
        //sanitizing and validating all fields
        email = sanitizeEmail(email);
        if (email === null) return sendError(res, "Invalid input for email");//TODO:  check error code
        fname = sanitizeName(fname);
        if (fname === null) return sendError(res, "Invalid input for first name");//TODO:  check error code
        lname = sanitizeName(lname);
        if (lname === null) return sendError(res, "Invalid input for last name");//TODO:  check error code
        country = sanitizeCountry(country);
        if (country === null) return sendError(res, "Invalid input for country");//TODO:  check error code

        const registeredUser = await registerUserBasic();
        if (!registeredUser || !registeredUser.UserID) {
            return sendError(res, "Could not register this user", 404);
        }
        return sendSuccess(res, "User registered successfully", {
            registerUser,
        });
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
        const { fname, lname, country, email, organizationID } =
            req.body;
        // Validate that all attributes exist
        if ( !fname || !lname || !country || !email || organizationID) {
            return sendError(res, "Arguments missing", 401); //TODO: Check status code
        }
        //sanitizing and validating all fields
        email = sanitizeEmail(email);
        email = sanitizeEmail(email);
        if (email === null) return sendError(res, "Invalid input for email");//TODO:  check error code
        fname = sanitizeName(fname);
        if (fname === null) return sendError(res, "Invalid input for first name");//TODO:  check error code
        lname = sanitizeName(lname);
        if (lname === null) return sendError(res, "Invalid input for last name");//TODO:  check error code
        country = sanitizeCountry(country);
        if (country === null) return sendError(res, "Invalid input for country");//TODO:  check error code
        password = sanitizePassword(password);
        if (country === null) return sendError(res, "Invalid input for country");//TODO:  check error code
        if (validateOrganizationID(organizationID )) return sendError(res, "Invalid input for organization");
        if (!city) {
        } else {
            city = sanitizeCity(city);
            if (city === null) return sendError(res, "Invalid input for city");//TODO: make more helpful message and check error code
        }

        if (!state) {
        } else {
            state = sanitizeState(state);
            if (state === null) return sendError(res, "Invalid input State");//TODO: make more helpful message and check error code
        }

        const registeredUser = await registerUserBasic();
        if (!registeredUser || !registeredUser.UserID) {
            return sendError(res, "Could not register this user", 404);
        }
        return sendSuccess(res, "User registered successfully", {
            registerUser,
        });
    } catch (error) {
        console.error(error);
        return sendError(
            res,
            "Something went wrong while registering user"
        );
    }
};