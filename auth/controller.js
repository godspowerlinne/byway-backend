const User = require("../models/User");
const jwt = require("jsonwebtoken"); // For generating JWT tokens to authenticate users

// Register a user
const signup = async (req, res) => {
    try {
        const {
            username,
            firstname,
            lastname,
            email,
            password,
            // Additional fields 
            role,
            bio,
            title,
            experience,
            socialLinks,
            profileImage
        } = req.body;

        // Check if the username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            if (existingUser.username) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.username === username ?
                        "Username already exists." :
                        "Email already exists.",
                });
            }
        }

        // Create a new user
        const newUser = new User({
            username,
            firstname,
            lastname,
            email,
            password,
            //Add optional fields
            ...(role && { role }),
            ...(bio && { bio }),
            ...(title && { title }),
            ...(experience && { experience }),
            ...(socialLinks && { socialLinks }),
            ...(profileImage && { profileImage }),
        });
        await newUser.save(); // Save the user to the database
        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                username: newUser.username,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                //Additional fields
                role: newUser.role,
                profileImage: newUser.profileImage,
                bio: newUser.bio,
                title: newUser.title,
                experience: newUser.experience,
                socialLinks: newUser.socialLinks,
            },
        });
    } catch (error) {
        console.error("Signup Error: ", error);
        res.status(500).json({
            success: false,
            message: "Error registering user.",
        });
    }
};

// Login a user
const login = async (req, res) => {
    try {
        // Get the username, email, and password from the request body
        const { username, email, password } = req.body;

        // Ensure that the user has provided either a username or an email
        if (!username && !email) {
            return res.status(400).json({
                success: false,
                message: "Please provide either a username or email.",
            });
        }

        // Try to find the user by their username or email
        let user = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or email.",
            });
        }

        // Check if the provided password matches the user's hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password.",
            });
        }

        // Generate a JSON Web Token (JWT) with the user's ID
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Expires in 1 day
        );

        // Send successful login response with JWT and user details
        res.json({
            success: true,
            message: "User logged in successfully.",
            token,
            user: {
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                //Additional fields
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                title: user.title,
                experience: user.experience,
                socialLinks: user.socialLinks,
            },
        });
    } catch (error) {
        console.error("Login Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error logging in user.",
        });
    }
}

// Get current user profile
const getCurrentUser = async (req, res) => {
    try {
        //user id comes from auth middleware
        const userId = req.userId;

        const user = await User.findById(userId)
            .select("-password")
            .populate("enrolledCourses", "title thumbnail progress")
            .populate("createdCourses", "title thumbnail progress")
            .populate("wishlist", "title thumbnail progress");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching current user profile",
            error: error.message,
        });
    }
};

module.exports = {
    signup,
    login,
    getCurrentUser,
};