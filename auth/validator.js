const { body, validationResult } = require("express-validator");

// signup validation
const signupValidationRules = [
    body("firstname")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("First name must be between 2 and 30 characters"),
    body("lastname")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("Last name must be between 2 and 30 characters"),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isAlphanumeric()
        .withMessage("Username must be alphanumeric")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")

];

// sign in validation
const signinValidationRules = [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Please enter a valid email address"),
    body("username").optional().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("email").custom((value, { req }) => {
        if (!value && !req.body.username) {
            throw new Error("Email or username is required");
        }
        return true;
    }),
];

//middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => err.msg),
        });
    }
    next();
};

module.exports = {
    signupValidationRules,
    signinValidationRules,
    validate,
};
