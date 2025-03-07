const { User, UserLogin, UserOrganization, Sequelize, sequelize } = require("../models"); // Import models
const bcrypt = require("bcryptjs");
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
async function getUserByID(userID){
    const user = await User.findByPk(userID);
    return user;
}

// Register
async function registerUserFull(email, password, fname, lname, city, state, country){
    try {
        console.log(password);
        password = await bcrypt.hash(password, 10);

        // Throw an error if user already exists
        const existingUser = await User.findOne({ where: { Email: email } });
        if (existingUser) {
            throw new Error("User already exists");
        }
        let user;
        //===================START TRANSACTION======================
        // Create user
        await sequelize.transaction(async t => {
              user = await User.create({
                UserName: email,
                FName: fname,
                LName: lname,
                City: city,
                State: state,
                Country: country,
                Email: email,
                CreationDate: Date.now(),
                LastEdited: Date.now(),
            });

            // Create UserLogin entry
            const userLogin = await UserLogin.create({
                UserID: user.UserID,
                Password: password,
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

        return { userId: user.UserID};
    } catch (err) {
        console.error(err);
        throw new Error("Error registering user");
    }
};

async function registerBasic(email, firstname, lastname, country) {
    try {

        // Send an error if no username or password is provided
        if (!email) {
            throw new Error("email required");
        }

        // Throw an error if user already exists
        const existingUser = await User.findOne({ where: { Email: email } });
        if (existingUser) {
            throw new Error("User already exists");
        }

        let user;
        //===================START TRANSACTION======================
        // Create user
        await sequelize.transaction(async t => {
            const user = await User.create({
                Username: email,
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
            password = await bcrypt.hash(password, 10);
            // Create UserLogin entry
            const userLogin = await userLogin.create({
                UserID: user.ID,
                Password: password,
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
        return { userId: user.id };
    } catch (err) {
        console.error(err);
        throw new Error("Error registering user");
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
        return  true;
    } catch (err) {
        console.error(err);
        throw new Error("Error registering user to organization");
    }

}


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
        return true;
    } catch (err) {
        console.error(err);
        throw new Error("Error deleting user");

    }
}

async function disableUserNormal(userID) {
    try {
        await sequelize.transaction(async t => {;
            await User.destroy({
                where: { UserID: userID },
            })
        }) //end of transaction
        return true;
    } catch (err) {
        console.error(err);
        throw new Error("Error deleting user");

    }
}

module.exports = {setOrganization, registerUserFull, registerBasic, disableUserOrganization, disableUserNormal, getUserByID}

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