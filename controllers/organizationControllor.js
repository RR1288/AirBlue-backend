const { Organization, UserOrganization, Sequelize, sequelize } = require("../models");


/*
creates an organization offered an ownerId, name, and description, 
it the creates the organization and adds the owner in as an administrator for the organization
*/
exports.createOrganization = async (name, description, ownerId) => {
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
                { transaction: t }
            );
            let userOrganization = await UserOrganization.create({
                UserID: ownerId,
                OrganizationID: organization.OrganizationID,
                Roles: 'A',
                StillActive: true,
            },
                { transaction: t }
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



exports.getUserOrganizationByUserID = async (userID) => {
    const userOrg = await UserOrganization.findOne({ where: { UserID: userID } });
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



exports.appendRoleUserOrganization = async (userId, role) => {
    try {
        // Start transaction
        await sequelize.transaction(async (t) => {
            // Step 1: Find the UserOrganization record for the given userId
            const userOrganization = await UserOrganization.findOne({
                where: { UserID: userId, StillActive: true },
                transaction: t,
            });

            if (!userOrganization) {
                throw new Error('User is not associated with any active organization');
            }

            // Step 2: Ensure that the user does not already have the role
            if (userOrganization.Roles.includes(role)) {
                throw new Error(`User already has the role: ${role}`);
            }

            // Step 3: Append the new role to the user's current roles
            const updatedRoles = userOrganization.Roles += role;
            userOrganization.Roles = updatedRoles;

            // Step 4: Save the updated userOrganization record
            await userOrganization.save({ transaction: t });

            // Return the updated roles as part of the response
            return { roles: userOrganization.Roles };

        });

        return true;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to append role to user organization');
    }
};

exports.deleteOrganization = async (userId) => {
    try {
        // Start a transaction to ensure atomic operations
        const result = await sequelize.transaction(async (t) => {
            // Step 1: Get the user's active organization from the UserOrganization table
            const userOrg = await UserOrganization.findOne({
                where: { UserID: userId, StillActive: true },
                transaction: t,
            });

            if (!userOrg) {
                throw new Error('User is not associated with any active organization');
            }

            // Step 2: Retrieve the organization based on the OrganizationID from UserOrganization
            const organization = await Organization.findByPk(userOrg.OrganizationID, { transaction: t });

            if (!organization) {
                throw new Error('Organization not found');
            }

            // Step 3: Check if the user is the owner of the organization (only owners can delete)
            if (organization.Owner !== userId) {
                throw new Error('You are not authorized to delete this organization');
            }

            // Step 4: Soft delete the organization by setting IsActive to false
            await organization.update({ IsActive: false }, { transaction: t });

            // Step 5: Deactivate all user associations with the organization
            await UserOrganization.update(
                { StillActive: false },
                { where: { OrganizationID: organization.OrganizationID }, transaction: t }
            );

            // Optional Step 6: Destroy events attached to the organization (if we want)
            // await Event.destroy({ where: { OrganizationID: organization.OrganizationID }, transaction: t });

            return true; // Success
        });

        return result; // Return true if the transaction completes successfully
    } catch (error) {
        console.error(error);
        throw error;  // Re-throw the original error, preserving the specific message
    }
};

