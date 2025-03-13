const express = require("express");
const JobApplication = require("../models/JobApplication");

const router = express.Router();

// 📌 Save Job Application
router.post("/", async (req, res) => {
    try {
        const newApplication = new JobApplication(req.body);
        await newApplication.save();
        res.status(201).json({ message: "✅ Application Submitted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "❌ Error Saving Application", error });
    }
});

module.exports = router;