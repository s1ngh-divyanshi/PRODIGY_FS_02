const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body; // Accept role from frontend
        
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already taken" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save the new user with their chosen role
        const newUser = new User({ username, password: hashedPassword, role: role || 'user' });
        await newUser.save();

        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Include the role in the JWT token payload
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the role back to the frontend so React knows who logged in
        res.status(200).json({ token, username: user.username, role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;