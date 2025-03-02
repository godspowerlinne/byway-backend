const express = require("express");
const router = express.Router();

const { signup, login } = require("./controller");
const {
    signupValidationRules,
    signinValidationRules,
    validate,
} = require("./validation");

// Signup route
router.post("/signup", signupValidationRules, validate, signup);

// Login route
router.post("/login", signinValidationRules, validate, login);

module.exports = router;
