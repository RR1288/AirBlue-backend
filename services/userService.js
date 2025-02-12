const {sendSuccess, sendError} = require("../utils/responseHelpers");
const {registerUser} = require("../controllers/userController");
const {User} = require("../models/userModel");

exports.registerUser = async (req, res) => {
    try {
        const {username, fname, lname, city, state, country, email, ktn} =
            req.body;
        // Validate that all attributes exist
        if (!username || !fname || !lname || !country || !email) {
            return sendError(res, "Arguments missing", 401); //TODO: Check status code
        }

        // Sanitize attributes
        // trim ws
        // truncate state, ktn
        
        
        // TODO: Create validations files

        // Validate attributes
        // username -> alphanumeric
        // fname, lname, city, country-> alphabeticSpace, alphanumeric?
        // state -> valid state?
        // email -> valid email
        // ktn -> numeric? what is this?

        
        // Assign to organization at creation? 
        // If so -> setup roles
        // Else -> basic permissions?
                    // check events? -> from Attendees (UserEvent)

        // This should go in the controller
        const user = await User.create({
            UserName: username,
            FName: fname,
            LName: lname,
            City: city ? city : null,
            State: state ? state : null,
            Country: country,
            Email: email,
            KTN: ktn ? ktn : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        req.user = user;

        const registedUser = await registerUser();
        if (!registedUser || !registedUser.UserID) {
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
