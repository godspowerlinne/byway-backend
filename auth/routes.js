const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { signup, login, getCurrentUser, updatePassword, updateProfile } = require("./controller");
const {
    signupValidationRules,
    signinValidationRules,
    passwordUpdateValidationRules,
    profileUpdateValidationRules,
    validate,
} = require("./validator");

const authMiddleware = require("../middlewares/authMiddleware");

// Configure multer for file uploads with directory check
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/profile-images/");
    },
    filename: function (req, file, cb) {
        cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Not an image! Please upload only images."), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2, // Limit to 2MB
    },
    fileFilter: fileFilter,
});

// Public routes
router.post("/signup", signupValidationRules, validate, signup);
router.post("/signin", signinValidationRules, validate, login);

// Protected routes that require authentication
router.get("/profile", authMiddleware, getCurrentUser);

router.put(
    "/profile",
    authMiddleware,
    upload.single("profileImage"),
    profileUpdateValidationRules,
    validate,
    updateProfile
);

router.put(
    "/password",
    authMiddleware,
    passwordUpdateValidationRules,
    validate,
    updatePassword
);

module.exports = router;