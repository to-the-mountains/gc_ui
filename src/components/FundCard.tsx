import React from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fundCard, logTransactions } from "../utils/apiService.tsx";

export default function FundCard() {
    const [searchParams] = useSearchParams();
    const customer = searchParams.get("customer") || "";
    const tourId = searchParams.get("tourId") || "";
    const subProgram = searchParams.get("subProgram") || "";
    const premium = (parseFloat(searchParams.get("premium") || "0")).toFixed(2);
    const refund = ((parseFloat(searchParams.get("refund") || "0"))).toFixed(2);
    const amount = (parseFloat(premium) + parseFloat(refund)).toFixed(2);

    const [formData, setFormData] = useState({
        attmid: "",
        // password: "",
        customer,
        tourId,
        subProgram,
        amount,
        premium,
        refund
    });

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

        // If the field is 'customer' or 'subProgram', allow letters and spaces
        if (id === "customer" || id === "subProgram") {
            setFormData((prevData) => ({
                ...prevData,
                [id]: value,  // Allow all characters for these fields
            }));
        } else {
            // For other fields, ensure only valid numeric input
            const numericValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except "."
            setFormData((prevData) => ({
                ...prevData,
                [id]: numericValue,
            }));
        }
    };

    const handleSubmit = async () => {
        if (isFormValid) {
            try {
                // Make the API call with `fundCard`
                const response = await fundCard({
                    attmid: formData.attmid,
                    amount: formData.amount,
                });

                // Check for specific keywords in the response
                if (response.includes("1,Transaction successful")) {
                    setStatusMessage("Card Funded Successfully!");
                    const locationMap = {
                        22: "Main Line",
                        23: "In House",
                        24: "Massanutten",
                    };
                    const locationId = localStorage.getItem("location");
                    const user = localStorage.getItem("username");
                    const location = locationMap[locationId || 22] || "Main Line";
                    const requestString = JSON.stringify({
                        attmid: formData.attmid,
                        amount: formData.amount,
                        transaction: "fundCard"
                    }, null, 2)
                    console.log(formData)
                    const logResponse = await logTransactions({
                        gcNumber: formData.attmid,
                        amount: formData.amount,
                        premium: formData.premium,
                        refund: formData.refund,
                        customer: formData.customer,
                        tourId: formData.tourId,
                        subProgram: formData.subProgram,
                        request: requestString,  // Pass your request string here
                        response: response,  // Pass your response string here
                        responseCode: "1",  // Pass your response code here
                        responseDesc: "Transaction successful",  // Pass response description
                        locationId: location, // Pass location ID here based on the form data or your source
                        creadtedBy: user
                    });
                    console.log(logResponse)
                } else if (response.includes("15,Error!")) {
                    setStatusMessage("Card Already Funded");
                }
                else {
                    setStatusMessage("Error Occurred. Card Failed to be Funded.");
                }
            } catch (error) {
                console.error("API Error:", error);
                setStatusMessage("An unexpected error occurred.");
            }
        }
    };


    const inputFields: { id: keyof typeof formData; label: string; type: string; maxLength?: number }[] = [
        { id: "attmid", label: "ATTMID #", type: "text" },
        // { id: "password", label: "PIN", type: "password", maxLength: 4 }, // Changed type to "password"
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
                paddingTop: "4rem",
            }}
        >
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
                <h1
                    style={{
                        textAlign: "center",
                        fontSize: "2rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                    }}
                >
                    Fund Card Details
                </h1>

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
                    Submit
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
