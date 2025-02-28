const { User, UserOrganization, Sequelize } = require("../models"); // Import models

exports.getAllEventPlanners = async (req, res) => {
    try {
        // Get all event planners
        const eventPlanners = await User.findAll({
            include: [
                {
                    model: UserOrganization,
                    where: { Roles: { [Sequelize.Op.like]: "%E%" } }, // Match users with 'E' in their roles
                    required: true,
                },
            ],
        });

        return eventPlanners;
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching event planners");
    }
};

// Register
exports.registerUserFull = async (req, res) => {
    try {
        // Get username, password and roles
        const { username, password } = req.body;

        // Send an error if no username or password is provided
        if (!username || !password) {
            return sendError(res, "Username and password required", 400);
        }

        // Throw an error if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return sendError(res, "User already exists", 400);
        }

        //===================START TRANSACTION======================
        // Create user
        await sequelize.transaction(async t => {
            const user = User.create({
                // Get from body
                UserName: email,
                FName: firstname,
                LName: lastname,
                City: city,
                State: state,
                Country: country,
                Email: email,
                KTN: ktn,
                CreationDate: Date.now(),
                LastEdited: Date.now(),
            });

            // Create UserLogin entry
            const userLogin = userLogin.create({
                UserID: user.id,
                Password: await bcrypt.hash(password, 10),
                two_fa_enabled: false,
                two_fa_secret: null,
                //MFATarget
                LastPasswordChange: Date.now(),
                LastMFAChange: null,
            });
            //TODO: logic for automated email to confirm account creation.
        });
        //===================END TRANSACTION======================
        // automatic rollback if an error occurs?
        return sendSuccess(res, "User registered", { userId: user.id });
    } catch (err) {
        console.error(err);
        return sendError(res, "Error registering user", 500);
    }

};

exports.registerBasic = async (req, res) => {
    try {
        // Get username, password and roles
        const { email } = req.body;

        // Send an error if no username or password is provided
        if (!email) {
            return sendError(res, "email required", 400);
        }

        // Throw an error if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return sendError(res, "User already exists", 400);
        }

        //===================START TRANSACTION======================
        // Create user
        await sequelize.transaction(async t => {
            const user = User.create({
                // Get from body
                UserName: email,
                FName: firstname,
                LName: lastname,
                City: null,
                State: null,
                Country: country,
                Email: email,
                KTN: null,
                CreationDate: Date.now(),
                LastEdited: Date.now(),
            });
            //need to randomly generate a password for the user
            let password = generateRandomPassword();
            // Create UserLogin entry
            const userLogin = userLogin.create({
                UserID: user.id,
                Password: await bcrypt.hash(password, 10),
                two_fa_enabled: false,
                two_fa_secret: null,
                //MFATarget
                LastPasswordChange: Date.now(),
                LastMFAChange: null,
            });
            //TODO: add logic to send email to user for their initial sign in
        });
        //===================END TRANSACTION======================
        // automatic rollback if an error occurs?
        return sendSuccess(res, "User registered", { userId: user.id });
    } catch (err) {
        console.error(err);
        return sendError(res, "Error registering user", 500);
    }

};


async function setOrganization(roles, organizationID, userID) {
    try {
        await sequelize.transaction(async t => {
            const uOrganization = UserOrganization.create({
                UserID: userID,
                OrganizationID: organizationID,
                DateGiven: Date.now(),
                Roles: roles,
                StillAcitve: true,
                updatedAt: Date.now(),
                createdAt: Date.now()
            });

        });
        return sendSuccess(res, "User registered", true);
    } catch (err) {
        console.error(err);
        return sendError(res, "Error registering user to organization", 500);
    }

}
module.exports = {setOrganization}

//helper funciton to generate a random initial password in the case of automated setup
function generateRandomPassword(length = 12) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*1234567890abcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];

    }
    return password;

}