const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Get the token from the authorization header
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, authorization denied",
            });
        }
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Find the user associated with the token
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // Set both user and token in request object for flexibility
        req.userId = decoded.userId;
        req.user = user;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token is not valid or has expired",
            error: error.message,
        });
    }
}

module.exports = authMiddleware;