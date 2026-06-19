const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Explicitly allow your Vite frontend to communicate with this backend
app.use(cors({
    origin: 'http://localhost:5173', // Your React app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

console.log("=== SERVER BOOT SEQUENCE ===");
if (!process.env.MONGO_URI) {
    console.log("❌ ERROR: MONGO_URI is completely UNDEFINED inside the code!");
} else {
    // Only print the first 20 characters so we don't leak your password in the logs
    console.log("🟢 MONGO_URI exists! It starts with: " + process.env.MONGO_URI.substring(0, 20));
}

// FIXED: Using 127.0.0.1 instead of localhost avoids Node.js IPv6 resolution issues
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employeeDB';

mongoose.connect(mongoURI)
    .then(() => console.log("🟢 Successfully connected to MongoDB"))
    .catch((err) => {
        console.error("🔴 MongoDB connection ERROR:");
        console.error("Ensure your local MongoDB service is running, or check your Atlas URI.");
        console.error(err.message);
    });

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🟢 Server running on port ${PORT}`);
});