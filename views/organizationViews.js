const {User, UserOrganization, Organization, Sequelize} = require('../models');


/**
 * this function takes the organization ID and returns the username and roles of each organization user and is availabe to all organization users
 */
exports.getOrganizationUsers = async (organizationID) =>{
    try {

        //should get roles from userOrganization
        //should get 
        let orgUsers = await UserOrganization.findAll({
            attributes: [[
                ['Roles', 'roles'],
            ]],
            includes: [
                {
                    model: User,
                    attributes: [
                        ['Email', 'email'],
                        ['FName', 'firstName'],
                        ['LName', 'lastName']
                    ],
                    required: true
                },
            ],
            where: {OrganizationID: organizationID}
        });
        let results = [];
        // turn output into a single object and add it to the results list
        for (let i = 0; i < orgUsers.length; i++){
            let combinedName = orgUsers[i].dataValues.User.firstName + orgUsers[i].dataValues.User.lastName;
            results.push({'Name': combinedName, 'email': orgUsers[i].dataValues.User.email, 'roles': orgUsers[i].dataValues.roles});
        }
        return users;
    } catch (error) {
        throw new Error('failed to get info');
    }
};

