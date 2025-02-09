const authorizedRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.roles)) {
            throw new Error("Forbidden: insufficient permissions");;
        }
        next();
    }
};

export {authorizedRoles};