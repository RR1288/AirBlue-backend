const {User, UserOrganization, Organization, Sequelize} = require('../models');


/**
 * this function takes the organization ID and returns the username and roles of each organization user and is availabe to all organization users
 */
exports.getOrganizationUsers = async (organizationID) =>{
    try {
        let orgUsers = await UserOrganization.findAll({
            attributes: [[
                
            ]],
            includes: [
                {
                    model: User,
                    attributes: []
                }
            ],
            where: {OrganizationID: organizationID}
        });

        return users;
    } catch (error) {
        
    }
};

