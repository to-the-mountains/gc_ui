import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fundCard } from "../utils/apiService.tsx";

const safeLocalStorageGet = (key: string, defaultValue: string): string => {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch (error) {
        console.error(`Error accessing localStorage for key "${key}":`, error);
        return defaultValue;
    }
};

export default function EditInfo() {
    const [searchParams] = useSearchParams();
    const customer = searchParams.get("customer") || "";
    const tourId = searchParams.get("tourId") || "";
    const subProgram = searchParams.get("subProgram") || "";
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
        password: "",
        customer,
        tourId,
        subProgram,
        amount: (parseFloat(searchParams.get("amount") || "0")).toFixed(2),
        premium: (parseFloat(searchParams.get("premium") || "0")).toFixed(2),
        refund: (parseFloat(searchParams.get("refund") || "0")).toFixed(2),
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

    // Validation logic
    const isFormValid =
        Object.values(formData).every((field) => field.trim() !== "") &&
        parseFloat(formData.premium) <= 500 &&
        parseFloat(formData.refund) <= 500 &&
        parseFloat(formData.amount) ===
        parseFloat(formData.premium) + parseFloat(formData.refund);

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
                // Make the API call with `updateInfo`
                
            } catch (error) {
                console.error("API Error:", error);
                setStatusMessage("An unexpected error occurred.");
            }
        }
    };


    const inputFields: { id: keyof typeof formData; label: string; type: string; maxLength?: number }[] = [
        { id: "customer", label: "Customer", type: "text" },
        { id: "tourId", label: "Tour ID", type: "text" },
        { id: "subProgram", label: "Sub Program", type: "text" },
        { id: "premium", label: "Premium", type: "text" },
        { id: "refund", label: "Refund", type: "text" },
        { id: "amount", label: "Amount", type: "text" },
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
            <h1
                style={{
                    textAlign: "left",
                    fontSize: "2rem",
                    fontWeight: "600",
                    marginLeft: "5vh",
                    marginBottom: "1rem",
                }}
            >
                Edit Gift Card for Location: {getStoredLocation()}
            </h1>
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
                    borderRadius: "0.5rem",
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
                    Update
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
