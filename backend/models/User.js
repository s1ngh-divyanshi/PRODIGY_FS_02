const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        trim: true,
        lowercase: true,
        // Robust regex for standard email pattern verification
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address structure']
    },
    password: {
        type: String,
        required: [true, 'Password field is required'],
        // Validates length BEFORE hashing takes place in pre-save hooks
        minlength: [8, 'Security policy requirement: Password must be at least 8 characters long']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);