import React, { useState } from "react";

const JobApplication = () => {
    const [formData, setFormData] = useState({
        jobId: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        yearOfGraduation: "",
        gender: "",
        experience: "",
        skills: "",
        location: "",
        pincode: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://hr-desk.onrender.com/api/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setMessage(data.message);
            setFormData({
                jobId: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                email: "",
                yearOfGraduation: "",
                gender: "",
                experience: "",
                skills: "",
                location: "",
                pincode: "",
            });
        } catch (error) {
            setMessage("❌ Network Error: " + error.message);
        }
    };

    return (
        <div>
            <h2>Apply for a Job</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="jobId" placeholder="Job ID" value={formData.jobId} onChange={handleChange} required />
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="yearOfGraduation" placeholder="Year of Graduation" value={formData.yearOfGraduation} onChange={handleChange} required />
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input type="text" name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} required />
                <input type="text" name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} required />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
};

export default JobApplication;
