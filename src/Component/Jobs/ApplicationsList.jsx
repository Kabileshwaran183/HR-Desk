import React, { useEffect, useState } from "react";
import API_URL from "../../config";

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        fetchApplications(abortController.signal);
        return () => abortController.abort(); // Cleanup on unmount
    }, []);

    const fetchApplications = async (signal) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/applications`, { signal });
            if (!response.ok) throw new Error("Failed to fetch applications");
            const data = await response.json();
            console.log("Applications Data:", data); // Debugging output
            setApplications(data);
            setError(null);
        } catch (error) {
            if (error.name !== "AbortError") {
                setError("Error fetching applications. Please try again.");
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submitted Applications</h2>

            {loading && <p className="text-center">Loading applications...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && applications.length === 0 && (
                <p className="text-center">No applications found.</p>
            )}

            {!loading && !error && applications.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Phone</th>
                                <th className="border p-2">Experience</th>
                                <th className="border p-2">Skills</th>
                                <th className="border p-2">Location</th>
                                <th className="border p-2">Pincode</th>
                                <th className="border p-2">Resume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app, index) => (
                                <tr key={app.id ? `app-${app.id}` : `index-${index}`} className="text-center">
                                    <td className="border p-2">{app.firstName} {app.lastName}</td>
                                    <td className="border p-2">{app.email}</td>
                                    <td className="border p-2">{app.phoneNumber}</td>
                                    <td className="border p-2">{app.experience}</td>
                                    <td className="border p-2">{app.skills}</td>
                                    <td className="border p-2">{app.location}</td>
                                    <td className="border p-2">{app.pincode}</td>
                                    <td className="border p-2">
                                        {app.resumeName ? (
                                            <a
                                                href={`${API_URL}/api/apply/uploads/${app.resumeName}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                                download
                                            >
                                                Download Resume
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">No Resume</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApplicationsList;
