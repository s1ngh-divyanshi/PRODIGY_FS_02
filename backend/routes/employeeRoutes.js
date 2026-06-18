const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { verifyAuth, verifyAdmin } = require('../middleware/authMiddleware');

// READ (Get all employees)
router.get('/', verifyAuth, async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE (Add new employee)
router.post('/', verifyAuth, verifyAdmin, async (req, res) => {
    console.log("📥 Incoming Data:", req.body); // Check what React is sending

    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        console.log("✅ Successfully Saved:", savedEmployee.name);
        res.status(201).json(savedEmployee);
    } catch (err) {
        console.error("❌ Failed to save employee:", err.message); // Print exact error
        res.status(400).json({ message: err.message || "Database validation failed" });
    }
});

// UPDATE (Edit an employee by ID)
router.put('/:id', verifyAuth, verifyAdmin, async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE (Remove an employee by ID)
router.delete('/:id', verifyAuth, verifyAdmin, async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json("Employee deleted.");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;