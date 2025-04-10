const { body, validationResult } = require("express-validator");

// signup validation
const signupValidationRules = [
    body("firstname")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Firstname must contain only letters, spaces or hyphens")
        .isLength({ min: 2, max: 30 })
        .withMessage("First name must be between 2 and 30 characters"),
    body("lastname")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Lastname must contain only letters, spaces or hyphens")
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
        .withMessage("Invalid email address")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    // Optional Fields validation
    body("role")
        .optional()
        .isIn(["student", "instructor", "admin"])
        .withMessage("Role must be either student, instructor, or admin"),

    body("bio")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Bio must be less than 500 characters"),

    body("title")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Title must be less than 100 characters"),

    body("experience")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Experience must be a positive number between 0 and 100"),

    body("socialLinks")
        .optional()
        .isObject()
        .withMessage("Social links must be an object")
        .custom((value) => {
            const validKeys = [
                "facebook",
                "twitter",
                "linkedin",
                "github",
                "website",
            ];
            const keys = Object.keys(value);
            for (let key of keys) {
                if (!validKeys.includes(key)) {
                    throw new Error(`Invalid social link key: ${key}`);
                }
            }
            return true;
        }),

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

const profileUpdateValidationRules = [
    body("firstname")
        .optional()
        .trim()
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Firstname must contain only letters, spaces or hyphens")
        .isLength({ min: 3, max: 30 })
        .withMessage("First name must be between 3 and 30 characters"),

    body("lastname")
        .optional()
        .trim()
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Lastname must contain only letters, spaces or hyphens")
        .isLength({ min: 3, max: 30 })
        .withMessage("lastname must be between 3 and 30 characters"),

    body("bio")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Bio cannot exceed 500 characters"),

    body("title")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Title cannot exceed 100 characters"),

    body("experience")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Experience cannot exceed 100 characters"),

    body("socialLinks")
        .optional()
        .isObject()
        .withMessage("Social links must be an object")
        .custom((value) => {
            const validKeys = [
                "facebook",
                "twitter",
                "linkedin",
                "github",
                "website",
            ];
            const keys = Object.keys(value);
            for (let key of keys) {
                if (!validKeys.includes(key)) {
                    throw new Error(`Invalid social link key: ${key}`);
                }
            }
            return true;
        }),
];

const passwordUpdateValidationRules = [
    body("currentPassword")
        .trim()
        .notEmpty()
        .withMessage("Current Password is required"),

    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New Password is required")
        .isLength({ min: 9 })
        .withMessage("Password must be at least 9 characters long")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/)
        .withMessage(
            "New Password must contain at least one letter and one number, and be at least 9 characters long"
        ),

    //optional but adding it
    body("confirmPassword")
        .trim()
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Password do not match");
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
            message: "Validation Failed",
            errors: errors.array().map((error) => ({
                field: error.param,
                message: error.msg,
            })),
        });
    }
    next();
};

module.exports = {
    signupValidationRules,
    signinValidationRules,
    profileUpdateValidationRules,
    passwordUpdateValidationRules,
    validate,
};
