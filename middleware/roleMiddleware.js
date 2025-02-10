const authorizedRoles = (...allowedRoles) => {
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
        throw new Error("Forbidden: insufficient permissions");
    };
};

export {authorizedRoles};
