require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoute = require('./auth/routes');
const errorHandler = require('./middlewares/errorHandler');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(cors(
    {
        origin: "*", // Allow requests from any origin
        Credentials: true
    }
));

app.use(express.json());

//Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
const profileImagesDir = path.join(uploadDir, "profile-images");
const courseImagesDir = path.join(uploadDir, "course-images");

// Create directories if they don't exist
[uploadDir, profileImagesDir, courseImagesDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log(`Created directory: ${dir}`);
    }
});

// Serve static files from uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});

app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoute);

app.use(errorHandler); // Error handling middleware

const url = process.env.MONGODB_URL;
const options = { serverSelectionTimeoutMS: 30000, connectTimeoutMS: 5000, }; // Set connection timeout to 30 seconds

// Connect to MongoDB before starting the server 
const connectDB = async () => {
    try {
        await mongoose.connect(url, options);
        console.log('Connected to MongoDB');

        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if connection fails
    }
};
connectDB();

// Export the app for Deployment
module.exports = app;