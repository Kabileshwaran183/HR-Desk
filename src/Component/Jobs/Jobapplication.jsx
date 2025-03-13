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
        setLoading(true);
        setParsed(false);

        if (file.type === "application/pdf") {
            await extractTextFromPDF(file);
        }
        await parseResumeWithAI(file);
        event.target.value = null;
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

            extractDetails(text);
        } catch (error) {
            console.error("Error extracting text from PDF:", error);
        }
    };

    const extractDetails = (text) => {
        const phoneRegex = /\b(?:\+91[-\s]?)?\d{5}[-\s]?\d{5}\b/;
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;

        setPhoneNumber(text.match(phoneRegex)?.[0] || "");
        setEmail(text.match(emailRegex)?.[0] || "");
    };

    const parseResumeWithAI = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("https://api.affinda.com/v2/resumes", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_AFFINDA_API_KEY}`,
                },
                body: formData,
            });

            const result = await response.json();
            if (result.data) {
                setFirstName(result.data.name?.first || "");
                setLastName(result.data.name?.last || "");
                setLocation(result.data.location?.text || "");
                setPincode(result.data.location?.postcode || "");
                setYearOfGraduation(result.data.education?.[0]?.completion_date || "");
                setGender(result.data.personal_info?.gender || "");

                setSkills(
                    result.data.skills?.map(skill => skill.name.trim()).join(", ") || "No relevant skills found"
                );
                setExperience(
                    result.data.work_experience?.map(exp => `${exp.job_title} at ${exp.organisation}`).join("\n") || "No work experience found"
                );
            }
        } catch (error) {
            console.error("Error parsing resume with AI:", error);
        }

        setLoading(false);
        setParsed(true);
    };

    const handleCancelResume = () => {
        setResumeName("");
        setPhoneNumber("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setSkills("");
        setExperience("");
        setLoading(false);
        setParsed(false);
        document.getElementById("resumeUpload").value = "";
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Apply for Job ID: {id}</h2>
            <form className="space-y-6">
                <div className="p-4 border-2 border-dashed rounded-lg text-center relative">
                    <label className="cursor-pointer flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-600">
                            {resumeName || "Upload Your Resume (PDF)"}
                        </span>
                        <input type="file" id="resumeUpload" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    </label>
                    {resumeName && (
                        <button type="button" onClick={handleCancelResume} className="absolute top-2 right-2 text-red-600">
                            <FaTimesCircle size={24} />
                        </button>
                    )}
                </div>
                {loading && <div className="text-center text-blue-600">Parsing resume...</div>}
                {parsed && <div className="text-center text-green-600">Resume parsed successfully!</div>}
            </form>
        </div>
    );
};

export default JobApplication;
