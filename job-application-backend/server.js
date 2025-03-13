const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const cors = require("cors");

// Allow all origins
app.use(cors());

// OR Allow specific origins (for security)
app.use(
    cors({
        origin: ["http://localhost:5000", "https://hr-desk-kabileshwaran183s-projects.vercel.app/"],
        methods: "GET,POST,PUT,DELETE",
        credentials: true, // Allow cookies if needed
    })
);

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Define Schema & Model
const jobApplicationSchema = new mongoose.Schema({
    jobId: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    yearOfGraduation: String,
    gender: String,
    experience: String,
    skills: String,
    location: String,
    pincode: String,
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

// API Route: Store Job Application
app.post("/api/apply", async (req, res) => {
    try {
        const application = new JobApplication(req.body);
        await application.save();
        res.status(201).json({ message: "Application submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error saving application" });
    }
});

// API Route: Retrieve All Applications
app.get("GET https://hr-desk-kabileshwaran183s-projects.vercel.app//api/applications/", async (req, res) => {
    try {
        const applications = await JobApplication.find();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving applications" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
