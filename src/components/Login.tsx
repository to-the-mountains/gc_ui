import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/loginUser.tsx"; // Import your loginUser function
import React from "react";

export default function Login() {
    const [location, setLocation] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const selectStyles = {
        borderRadius: '8px',
        fontSize: 'xx-large',
        width: '20%',
        marginRight: '10px',
        backgroundColor: '#2c3e50',
        color: 'white',
        border: '2px solid #3498db',
        padding: '10px',
        margin: '10px',
        //textAlign: 'center',
        lineHeight: '40px'
    };

    function handleLocation(location: string) {
        // Convert the string to a number
        setLocation(location);
        const locationNumber = Number(location);
    
        // Store the number in localStorage
        localStorage.setItem('location', locationNumber.toString());
    
        return locationNumber;
    }

    const handleLogin = async () => {
        // if (location) {
            const user = await loginUser(location); // Call the loginUser function
            if (user) {
                navigate("/tour"); // Redirect to /tour after successful login
            } else {
                console.error('Login failed');
            }
        // }
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh'
            }}>
                {/* <select
                    className="text-black rounded-md p-2"
                    style={selectStyles}
                    onChange={(event)=>handleLocation(event.target.value)}
                    value={location}
                >
                    <option value="" hidden>Select Your Location</option>
                    <option value={22}>Main Line</option>
                    <option value={23}>In House</option>
                    <option value={24}>Massanutten</option>
                </select> */}
                <button
                    style={{
                        backgroundColor: '#F15e44', // Grey out when no location is selected
                        color: 'white',
                        padding: '10px 15px',
                        fontSize: 'xxx-large',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer', // Pointer when enabled, not-allowed when disabled
                        width: '30%',
                        height: '30%',
                        marginTop: '20px'
                    }}
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
}
