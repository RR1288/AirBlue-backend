const { Organization, UserOrganization,Sequelize } = require("../models");

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