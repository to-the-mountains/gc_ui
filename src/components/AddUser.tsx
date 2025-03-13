import React, { useState } from "react";
import { addUser } from "../utils/apiService.tsx";
import { UseUser } from "../utils/userContext.tsx";
import LogInPrompt from "./LogInPrompt.tsx";

export default function AddUser() {
    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        role: "",
        location: ""
    });

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [clearForm, setClearForm] = useState<boolean>(false);

    const roles = ["Admin", "User"];
    const locations = ["Main Line", "In House", "Massanutten"];

    const isFormValid = Object.values(formData).every((field) => field.trim() !== "");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async () => {
        if (isFormValid) {
            try {
                addUser(formData);
            } catch (error) {
                console.error("API Error:", error);
                setStatusMessage("An unexpected error occurred.");
            }
        }
    };

    const { user } = UseUser();

    const checkLogin = () => user == null;

    const handleClearForm = () => {
        setFormData({
            username: "",
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            role: "",
            location: ""
        });
        setStatusMessage("");
    };

    return (
        <div style={{ width: "100%", backgroundColor: "#f3f4f6", padding: "1rem", paddingTop: "4rem" }}>
            <main style={{ display: "flex", flexDirection: "column", gap: "1rem", marginLeft: "5vh", width: "30vw", maxWidth: "90%", border: "2px solid #d1d5db", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", padding: "1.5rem", backgroundColor: "white" }}>
                <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "600", marginBottom: "1rem" }}>User Details</h1>
                <label>Username</label>
                <input id="username" value={formData.username} onChange={handleInputChange} />
                <label>First Name</label>
                <input id="firstname" value={formData.firstname} onChange={handleInputChange} />
                <label>Last Name</label>
                <input id="lastname" value={formData.lastname} onChange={handleInputChange} />
                <label>Phone</label>
                <input id="phone" value={formData.phone} onChange={handleInputChange} />
                <label>Email</label>
                <input id="email" value={formData.email} onChange={handleInputChange} />
                
                <label>Role</label>
                <select id="role" value={formData.role} onChange={handleSelectChange}>
                    <option value="">Select Role</option>
                    {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
                
                <label>Location</label>
                <select id="location" value={formData.location} onChange={handleSelectChange}>
                    <option value="">Select Location</option>
                    {locations.map((location) => <option key={location} value={location}>{location}</option>)}
                </select>
                
                <button disabled={!isFormValid} onClick={handleSubmit} style={{ marginTop: "1rem", padding: "0.75rem", fontSize: "1rem", fontWeight: "600", backgroundColor: isFormValid ? "#4CAF50" : "#D3D3D3", color: "white", border: "none", borderRadius: "0.25rem", cursor: isFormValid ? "pointer" : "not-allowed" }}>Add User</button>
                {clearForm && <button onClick={handleClearForm} style={{ marginTop: "0.5rem", padding: "0.75rem", fontSize: "1rem", fontWeight: "600", backgroundColor: "#D14343", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>Clear Form</button>}
                {statusMessage && <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "1rem", color: statusMessage.includes("Successfully") ? "#4CAF50" : "#D14343", fontWeight: "500" }}>{statusMessage}</p>}
            </main>
            <LogInPrompt user={user} open={checkLogin()} />
        </div>
    );
}
