const {
    User,
    UserLogin,
    UserOrganization,
    Sequelize,
    sequelize,
} = require("../models");
const bcrypt = require("bcryptjs");

exports.getAllEventPlanners = async (req, res) => {
    try {
        const eventPlanners = await User.findAll({
            include: [
                {
                    model: UserOrganization,
                    where: {Roles: {[Sequelize.Op.like]: "%E%"}},
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

exports.getUserByID = async (userID) => {
    return await User.findByPk(userID);
};

exports.registerUserFull = async (
    email,
    password,
    fname,
    lname,
    city,
    state,
    country
) => {
    try {
        password = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({where: {Email: email}});
        if (existingUser) {
            throw new Error("User already exists");
        }

        let user;
        await sequelize.transaction(async (t) => {
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

            await UserLogin.create({
                UserID: user.UserID,
                Password: password,
                two_fa_enabled: false,
                two_fa_secret: null,
                LastPasswordChange: Date.now(),
                LastMFAChange: null,
            });
        });
        return {userId: user.UserID};
    } catch (err) {
        console.error(err);
        throw new Error("Error registering user");
    }
};

exports.registerBasic = async (email, firstname, lastname, country) => {
    try {
        if (!email) {
            throw new Error("Email required");
        }

        const existingUser = await User.findOne({where: {Email: email}});
        if (existingUser) {
            throw new Error("User already exists");
        }

        let user;
        await sequelize.transaction(async (t) => {
            user = await User.create({
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

            let password = exports.generateRandomPassword();
            password = await bcrypt.hash(password, 10);

            await UserLogin.create({
                UserID: user.ID,
                Password: password,
                two_fa_enabled: false,
                two_fa_secret: null,
                LastPasswordChange: Date.now(),
                LastMFAChange: null,
            });
        });
        return {userId: user.id};
    } catch (err) {
        console.error(err);
        throw new Error("Error registering user");
    }
};

exports.setOrganization = async (roles, organizationID, userID) => {
    try {
        await sequelize.transaction(async (t) => {
            await UserOrganization.create({
                UserID: userID,
                OrganizationID: organizationID,
                DateGiven: Date.now(),
                Roles: roles,
                StillAcitve: true,
                updatedAt: Date.now(),
                createdAt: Date.now(),
            });
        });
        return true;
    } catch (err) {
        console.error(err);
        throw new Error("Error registering user to organization");
    }
};

exports.updateUser = async (userId, firstname, lastname, state, city, ktn) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }
        await user.update({
            FName: firstname,
            LName: lastname,
            City: city,
            State: state,
            KTN: ktn,
        });
        return true;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to update user");
    }
};

exports.disableUserOrganization = async (userID, organizationID) => {
    try {
        await sequelize.transaction(async (t) => {
            await User.destroy({where: {UserID: userID}});
            await UserOrganization.destroy({
                where: {UserID: userID, OrganizationID: organizationID},
            });
        });
        return true;
    } catch (err) {
        console.error(err);
        throw new Error("Error deleting user");
    }
};

exports.disableUserNormal = async (userID) => {
    try {
        await sequelize.transaction(async (t) => {
            await User.destroy({where: {UserID: userID}});
        });
        return true;
    } catch (err) {
        console.error(err);
        throw new Error("Error deleting user");
    }
};

exports.generateRandomPassword = (length = 12) => {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*1234567890abcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

//passwords
exports.updatePassword = async (userID, password) => {
    try {
        let userLogin = await UserLogin.findByPk(userID);
        if(!userLogin){
            throw new Error("could not find user");
        }
        userLogin.update({
            Password: password,
        });
        return true;
    } catch (error) {
        throw new Error("failed to update password");
    }
};
