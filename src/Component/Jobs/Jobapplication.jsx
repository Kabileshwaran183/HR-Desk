import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min";  
import { FaTimesCircle } from "react-icons/fa"; 

const JobApplication = () => {
    const { id } = useParams();
    const [resumeName, setResumeName] = useState("");
    const [firstName, setFirstName] = useState(""); 
    const [lastName, setLastName] = useState("");  
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState(""); 
    const [yearOfGraduation, setYearOfGraduation] = useState(""); 
    const [gender, setGender] = useState(""); 
    const [experience, setExperience] = useState(""); 
    const [skills, setSkills] = useState(""); 
    const [location, setLocation] = useState(""); 
    const [pincode, setPincode] = useState("");
    const [loading, setLoading] = useState(false);
    const [parsed, setParsed] = useState(false);
   
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setResumeName(file.name);
        setLoading(true); // Show loading animation

        if (file.type === "application/pdf") {
            await extractTextFromPDF(file);
        }
    };

   
    const extractTextFromPDF = async (file) => {
        try {
            pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.js",
                import.meta.url
            ).toString();

            const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise;
            let text = "";

            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map((item) => item.str).join(" ") + " ";
            }

            console.log("Extracted Resume Text:", text); // ✅ Debugging log
            extractDetails(text);
        } catch (error) {
            console.error("Error extracting text from PDF:", error);
        }
    };

   
    const extractDetails = (text) => {
        console.log("Analyzing Extracted Text...");

       
        const phoneRegex = /\b(?:\+91[-\s]?)?\d{5}[-\s]?\d{5}\b/;

      
        const foundPhone = text.match(phoneRegex)?.[0]?.replace(/[-\s().]/g, "") || "";

        
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
        const foundEmail = text.match(emailRegex)?.[0] || "";

        console.log("Detected Phone Number:", foundPhone);
        console.log("Detected Email:", foundEmail);
        


        setPhoneNumber(foundPhone);
        setEmail(foundEmail);  // Set the email in state
        setLoading(false); // Hide loading animation
        setParsed(true); // Show success message
    };

   
    const handleCancelResume = () => {
        setResumeName("");
        setPhoneNumber("");
        setEmail("");
        setLoading(false);
        setParsed(false);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Apply for Job ID: {id}
            </h2>

            <form className="space-y-6">
                {/* 📌 Resume Upload */}
                <div className="p-4 border-2 border-dashed rounded-lg text-center relative">
                    <label className="cursor-pointer flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-600">
                            {resumeName ? resumeName : "Upload Your Resume (PDF, DOCX)"}
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                            required
                        />
                    </label>

                  
                    {resumeName && (
                        <button
                            type="button"
                            onClick={handleCancelResume}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        >
                            <FaTimesCircle size={24} />
                        </button>
                    )}
                </div>

                
                {loading && (
                    <div className="flex justify-center mt-4">
                        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                )}

               
                {parsed && !loading && (
                    <div className="text-green-600 mt-4 text-center">
                        <p>Resume parsed successfully. Carefully review your information before submitting the application.</p>
                    </div>
                )}

               
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your first name"
                        required
                    />
                </div>

                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your last name"
                        required
                    />
                </div>

                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        required
                    />
                </div>

             
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        required
                    />
                </div>

                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Year of Graduation</label>
                    <input
                        type="number"
                        value={yearOfGraduation}
                        onChange={(e) => setYearOfGraduation(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your year of graduation"
                        required
                    />
                </div>

             
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

               
                <div>
                    <label className="block text-sm font-medium text-gray-700">Experience (in years)</label>
                    <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your experience in years"
                        required
                    />
                </div>

               
                <div>
                    <label className="block text-sm font-medium text-gray-700">Skills</label>
                    <textarea
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your skills (comma separated)"
                        required
                    />
                </div>

              
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your current location"
                        required
                    />
                </div>

               
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your pincode"
                        required
                    />
                </div>

           
                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        className="w-48 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Submit Application
                    </button>
                    <button
                        type="button"
                        className="w-48 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500 transition duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobApplication;
