import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { voidCard } from "../utils/apiService.tsx";

const safeLocalStorageGet = (key: string, defaultValue: string): string => {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch (error) {
        console.error(`Error accessing localStorage for key "${key}":`, error);
        return defaultValue;
    }
};

export default function VoidCard() {
    const [searchParams] = useSearchParams();
    const customer = searchParams.get("customer") || "";
    const gc = searchParams.get("gc") || ""; // Get the gc value from the query params
    const locationMapping: { [key: number]: string } = {
        22: "Main Line",
        23: "In House",
        24: "Massanutten",
    };
    const [location, setLocation] = useState<number>(() => {
        return parseInt(safeLocalStorageGet("location", "22")); // Default to 22
    });

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "location" && event.newValue) {
                setLocation(parseInt(event.newValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const [formData, setFormData] = useState({
        attmid: "",
        cardId: ""
    });

    const getStoredLocation = (): string => {
        if (typeof window !== "undefined") {
            const storedLocation = localStorage.getItem("location");
            if (storedLocation) {
                const locationId = parseInt(storedLocation);
                const locationName = locationMapping[locationId]
                if (locationId >= 22 && locationId <= 24) return locationName;
            }
        }
        return locationMapping[22]; // Default to Main Line if not set or invalid
    };

    const [statusMessage, setStatusMessage] = useState<string>("");

    // Validation logic: Ensure `attmid` equals `gc`
    const isFormValid =
        Object.values(formData).every((field) => field.trim() !== "") && formData.attmid === gc;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        // Ensure only valid numeric input
        const numericValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except "."
        setFormData((prevData) => ({
            ...prevData,
            [id]: numericValue,
        }));
    };

    const handleSubmit = async () => {
        if (isFormValid) {
            try {
                // Make the API call with `fundCard`
                const response = await voidCard({
                    attmid: formData.attmid,
                    cardId: formData.cardId,
                });
    
                // Check for specific keywords in the response
                if (response.includes("1,Transaction successful")) {
                    setStatusMessage("Card Funded Successfully!");
                } else if (response.includes("15,Error!")) {
                    setStatusMessage("Card Already Funded");
                } else {
                    setStatusMessage("Error Occurred. Card Failed to be Funded.");
                }
            } catch (error) {
                console.error("API Error:", error);
                setStatusMessage("An unexpected error occurred.");
            }
        }
    };

    const inputFields: { id: keyof typeof formData; label: string; type: string; maxLength?: number }[] = [
        { id: "cardId", label: "Card ID", type: "text" },
        { id: "attmid", label: "ATTMID #", type: "text" }
    ];

    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "#f3f4f6",
                padding: "1rem",
                paddingTop: "2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginLeft: "5vh",
                    height: "auto",
                    width: "30vw",
                    maxWidth: "90%",
                    border: "2px solid #d1d5db",
                    borderRadius: "10px 10px 0px 0px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "1.5rem",
                    backgroundColor: "#d1d5db",
                }}
            >
                <h1
                    style={{
                        textAlign: "left",
                        fontSize: "1.6rem",
                        fontWeight: "600",
                        marginLeft: "5vh",
                        marginBottom: "1rem",
                        paddingTop: "1rem"
                    }}
                >
                    Void Gift Card for Location: {getStoredLocation()}
                </h1>
                <h2
                    style={{
                        textAlign: "left",
                        fontSize: "1rem",
                        fontWeight: "600",
                        marginLeft: "5vh",
                        marginBottom: "1rem",
                    }}
                >
                    Voiding card for: {customer}
                </h2>
                <h2
                    style={{
                        textAlign: "left",
                        fontSize: "1rem",
                        fontWeight: "600",
                        marginLeft: "5vh",
                        marginBottom: "1rem",
                    }}
                >
                    Please enter Card Id on BACK of card, and re-enter matching ATTMID
                </h2>
            </div>
            <main
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginLeft: "5vh",
                    height: "auto",
                    width: "30vw",
                    maxWidth: "90%",
                    border: "2px solid #d1d5db",
                    borderRadius: "0px 0px 10px 10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "1.5rem",
                    backgroundColor: "white",
                }}
            >

                {inputFields.map((field, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}
                    >
                        <label
                            style={{
                                fontSize: "1rem",
                                fontWeight: "500",
                                color: "#374151",
                            }}
                        >
                            {field.label}
                        </label>
                        <input
                            id={field.id}
                            value={formData[field.id]}
                            type={field.type}
                            maxLength={field.maxLength}
                            onChange={handleInputChange}
                            style={{
                                padding: "0.5rem",
                                fontSize: "1rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.25rem",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                        />
                    </div>
                ))}

                <button
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        fontSize: "1rem",
                        fontWeight: "600",
                        backgroundColor: isFormValid ? "#4CAF50" : "#D3D3D3",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: isFormValid ? "pointer" : "not-allowed",
                        transition: "background-color 0.2s",
                    }}
                >
                    Void
                </button>

                {statusMessage && (
                    <p
                        style={{
                            marginTop: "1rem",
                            textAlign: "center",
                            fontSize: "1rem",
                            color: statusMessage.includes("Successfully") ? "#4CAF50" : "#D14343",
                            fontWeight: "500",
                        }}
                    >
                        {statusMessage}
                    </p>
                )}
            </main>
        </div>
    );
}
