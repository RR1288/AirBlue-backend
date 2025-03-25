const {User, UserOrganization, Organization, Sequelize} = require('../models');


/**
 * this function takes the organization ID and returns the username and roles of each organization user and is availabe to all organization users
 */
exports.getOrganizationUsers = async (organizationID) =>{
    try {

        //should get roles from userOrganization
        //should get 
        let orgUsers = await UserOrganization.findAll({
            attributes: [
                ['Roles', 'roles'],
            ],
            include: [
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
            let combinedName = orgUsers[i].User.dataValues.firstName + orgUsers[i].User.dataValues.lastName;
            results.push({'Name': combinedName, 'email': orgUsers[i].User.dataValues.email, 'roles': orgUsers[i].dataValues.roles});
        }
        return results;
    } catch (error) {
        console.log(error);
        throw new Error('failed to get info');
    }
};

exports.getOrganizationInfo = async (organizationID) =>{
    try {
        let organization = await Organization.findByPk(organizationID, {
            attributes: [
                ['OrganizationName', 'name'],
                ['Description', 'description'],          
            ],
            include: [{
                model: User,
                attributes: [
                    ['Email', 'email'],
                    ['FName', 'firstName'],
                    ['LName', 'lastName']
                ],
                required: true
            }],
        });
        // format output
        let result;
        // turn output into a single object and add it to the results list
            let combinedName = organization.User.dataValues.firstName + organization.User.dataValues.lastName;
            result = {
                'Name': organization.dataValues.name,
                'Description': organization.dataValues.description,
                'OwnerName': combinedName, 
                'OwnerEmail': organization.User.dataValues.email,
            };
        return result;
    } catch (error) {
        throw new Error('failed to get organization information');
    }
};


