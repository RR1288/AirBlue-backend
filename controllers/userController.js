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
exports.register = async (req, res) => {
    try {
        // Get username, password and roles
        const { username, password, roles } = req.body;

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
                UserName: username,
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
                Password: password,
                two_fa_enabled: false,
                two_fa_secret: null,
                //MFATarget
                LastPasswordChange: Date.now(),
                LastMFAChange: null,
            });

            // Assign an organization to it
        });
        //===================END TRANSACTION======================
        // automatic rollback if an error occurs?
        return sendSuccess(res, "User registered", { userId: user.id });
    } catch (err) {
        console.error(err);
        return sendError(res, "Error registering user", 500);
    }
};


async function disableUserOrganization(userID, organizationID) {
    try {
        await sequelize.transaction(async t => {
            await User.destroy({
                where: { UserID: userID },

            })
            await UserOrganization.destroy({
                where: { UserID: userID, OrganizationID: organizationID },
            })
        }) //end of transaction
    } catch (err) {
        console.error(err);
        throw new Error("Error deleting user");

    }
}

async function disableUserNormal(userID, organizationID) {
    try {
        await sequelize.transaction(async t => {
            await User.destroy({
                where: { UserID: userID },
            })
        }) //end of transaction
    } catch (err) {
        console.error(err);
        throw new Error("Error deleting user");

    }
}

module.exports = {

}