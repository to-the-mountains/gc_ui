import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/loginUser.tsx"; // Import your loginUser function
import React from "react";
import { UseUser } from '../utils/userContext.tsx';

export default function Login() {
    const { setUser } = UseUser();
    useEffect(() => {
        // Clear storage
        localStorage.clear();
        sessionStorage.clear();

        // Clear the user from context
        setUser(null); // This will ensure that the user context is updated
    }, [setUser]);

    const navigate = useNavigate(); // Hook for navigation


    const handleLogin = async () => {
        // if (location) {
            const user = await loginUser(); // Call the loginUser function
            if (user) {
                setUser(user);
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
