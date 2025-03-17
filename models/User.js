const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ["admin", "student", "instructor"],
        default: "student",
    },
    profileImage: {
        type: String,
        default: "default.jpg",
    },
    bio: {
        type: String,
        default: "",
    },
    title: {
        type: String,
        default: "",
    },
    experience: {
        type: Number,
        default: "",
    },
    socialLinks: {
        facebook: String,
        twitter: String,
        linkedin: String,
        github: String,
        website: String,
    },

    // Some things related to the users to track the courses they have enrolled in, or that they are a tutor of
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }, ],

    // tracks the users created course
    createdCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }, ],

    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }, ],
}, {
    timestamps: true
});

// Hash the password before saving it to the database
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
// Method to get fullname
userSchema.methods.getFullName = function() {
    return `${this.firstname} ${this.lastname}`;
};

// to get the number of courses registered for a user (instructor)
userSchema.virtual("courseCount").get(function() {
    return this.createdCourses?.length || 0;
});

const User = mongoose.model("User", userSchema);

module.exports = User;