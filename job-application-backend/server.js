require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Define Schema and Model
const applicationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    experience: String,
    skills: String,
    location: String,
    pincode: String,
    resumeName: String,
});

const Application = mongoose.model("Application", applicationSchema);

// API Route to Fetch Applications
app.get("/api/applications", async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications", error });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
