const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Defining both fields guarantees Mongoose can read old AND new accounts
    username: {
        type: String,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password field is required.']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);