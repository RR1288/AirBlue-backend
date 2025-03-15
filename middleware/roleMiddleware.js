const { sendError } = require('../utils/responseHelpers');
const {getUserOrganizationByUserID} = require("../controllers/organizationControllor")
exports.authorizedRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // E: Event Planner, F: Financial Officer, A: Admin
        // Check if user has any roles
        const roles = req.user?.roles;

        if (req.user && roles) {
            const rolesArr = roles.split("");

            // Check if any role is allowed
            const isAuthorized = rolesArr.some((role) =>
                allowedRoles.includes(role)
            );

            if (isAuthorized) {
                return next();
            }
        }
        return sendError(res, "Forbidden: Insufficient permissions", 401);
    };
};

exports.checkUserAuthorizedRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        // E: Event Planner, F: Financial Officer, A: Admin
        // Check if user has any roles
        const {userID} = req.body;
        let roles = await getUserOrganizationByUserID(userID);
        roles = roles.Roles;
        if (req.user && roles) {
            const rolesArr = roles.split("");

            // Check if any role is allowed
            const isAuthorized = rolesArr.some((role) =>
                allowedRoles.includes(role)
            );

            if (isAuthorized) {
                return next();
            }
        }
        return sendError(res, "Forbidden: Insufficient permissions", 401);
    };
};
