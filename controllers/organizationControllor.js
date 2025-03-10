const { Organization, Sequelize } = require("../models");

//searches for an organization by primary key
//if no organization found it will return a null value
async function getOrganization(organizationID) {
    const organization = await Organization.findByPk(organizationID);
    return organization;
}

module.exports = {
    getOrganization
}
