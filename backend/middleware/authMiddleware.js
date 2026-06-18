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

module.exports = { verifyAuth, verifyAdmin };