const { Organization, Sequelize } = require("../models");

//searches for an organization by primary key
//if no organization found it will return a null value
exports.getOrganization = async (req, res) => {
    const organizationID = req.body;
    const organization = await Organization.findByPk(organizationID);
    return organization

}
