const {User, UserOrganization, Sequelize} = require("../models"); // Import models

exports.getAllEventPlanners = async (req, res) => {
    try {
        // Get all event planners
        const eventPlanners = await User.findAll({
            include: [
                {
                    model: UserOrganization,
                    where: {Roles: {[Sequelize.Op.like]: "%E%"}}, // Match users with 'E' in their roles
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

exports.registerUser = async (req, res) => {
    
}