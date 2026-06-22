const jwt = require('jsonwebtoken');

// Guard 1: Must be logged in (User or Admin)
const verifyAuth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access Denied." });

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = verified; // This now contains { id, role }
        next(); 
    } catch (err) {
        res.status(400).json({ message: "Invalid token." });
    }
};

// Guard 2: Must be an Admin
const verifyAdmin = (req, res, next) => {
    // If they aren't an admin, kick them out
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access Denied. Admins only." });
    }
    next(); // If they are an admin, let them through
};

const registerUser = async (req, res) => {
    const { email, password, role } = req.body;

    // 1. Explicit email format evaluation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Authentication failed: Invalid email address configuration." });
    }

    // 2. Clear minimum length evaluation
    if (!password || password.length < 8) {
        return res.status(400).json({ message: "Authentication failed: Password must be a minimum of 8 characters long." });
    }

    try {
        // Proceed with your existing bcrypt hashing logic and User.create()
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword, role });
        
        res.status(201).json({ message: "User registered successfully", userId: newUser._id });
    } catch (err) {
        res.status(500).json({ message: "Registration lifecycle error", error: err.message });
    }
};

module.exports = { verifyAuth, verifyAdmin };