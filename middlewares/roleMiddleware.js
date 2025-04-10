// Middleware for role-based access control

//Check if user is an instructor or admin
const isInstructor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access",
        });
    }

    if (req.user.role === "instructor" || req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied, you do not have the required role",
        });
    }
};

// Check if user is an admin
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    if (req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied, Admin role required",
        });
    }
};

modules.export = {
    isInstructor,
    isAdmin,
};