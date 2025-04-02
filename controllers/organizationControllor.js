const { Organization, UserOrganization,Sequelize, sequelize } = require("../models");


/*
creates an organization offered an ownerId, name, and description, 
it the creates the organization and adds the owner in as an administrator for the organization
*/
exports.createOrganization = async (name, description, ownerId) =>{
    try {
        //start transaction
        let organization;
        await sequelize.transaction(async (t) => {
            organization = await Organization.create({
                OrganizationName: name,
                Description: description,
                Owner: ownerId,
                IsActive: true,
            },
            {transaction: t}
            );
            let userOrganization = await UserOrganization.create({
                UserID: ownerId,
                OrganizationID: organization.OrganizationID,
                Roles: 'A',
                StillActive: true,
            },
            {transaction: t}
            );
        });
        if (!organization) throw new Error('could not make organization');
        return true;//on success just return true to tell the use that they have made an org as otherwise you may be returning to much info
    } catch (error) {
        console.log(error);
        throw new Error('failed to create organization');
    }
};




/*

GET FUNCTIONS
- all of these will likely need to get moved to views eventually
*/
//searches for an organization by primary key
//if no organization found it will return a null value
exports.getOrganization = async (organizationID) => {
    const organization = await Organization.findByPk(organizationID);
    return organization;
};



exports.getUserOrganizationByUserID = async (userID) =>{
    const userOrg = await UserOrganization.findOne({where: {UserID: userID}});
    return userOrg;
};

exports.updateOrganization = async (userId, updates) => {
    try {
        // Find the user’s organization
        const userOrganization = await UserOrganization.findOne({
            where: { UserID: userId, StillActive: true },
        });

        if (!userOrganization) {
            throw new Error('User is not associated with any active organization');
        }

        const organizationId = userOrganization.OrganizationID;

        // Find the organization to update
        const organization = await Organization.findByPk(organizationId);

        if (!organization) {
            throw new Error('Organization not found');
        }

        // Update the organization with the provided fields (name, description, etc.)
        await organization.update(updates);

        return organization; // Return the updated organization
    } catch (error) {
        console.error(error);
        throw new Error('Failed to update organization');
    }
};
