const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
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
    resumeName: String
}, { timestamps: true });

module.exports = mongoose.model("JobApplication", JobApplicationSchema);