import { useEffect, useState, useMemo } from "react";
import React from 'react';
import { getTourList } from "../utils/apiService.tsx";
import { Link } from "react-router-dom";
import "../styles/Tour.css"

const getStoredLocation = (): number => {
    if (typeof window !== "undefined") {
        const storedLocation = localStorage.getItem("location");
        if (storedLocation) {
            const locationId = parseInt(storedLocation);
            if (locationId >= 22 && locationId <= 24) return locationId;
        }
    }
    return 22; // Default to Main Line if not set or invalid
};

export default function Tour() {
    type Tour = {
        arrival: string;
        customer: string;
        tourId: string;
        subProgram: string;
        premium: string;
        refund: string;
        tourStatus: string;
        gcNumber: string;
        cardStatus: string;
    };

    const [tourList, setTourList] = useState<Tour[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [username] = useState(() =>
        typeof window !== "undefined" ? localStorage.getItem("username") || "defaultUsername" : "defaultUsername"
    );

    const [location, setLocation] = useState<number>(getStoredLocation);
    const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);

    const filteredTourList = useMemo(() => {
        return tourList.filter(
            (tour) =>
                tour.customer.toLowerCase().includes(searchInput.toLowerCase()) ||
                (tour.gcNumber && tour.gcNumber.toLowerCase().includes(searchInput.toLowerCase()))
        );
    }, [searchInput, tourList]);

    const fetchTourList = async () => {
        try {
            const results = await getTourList({
                username: username,
                date: date,
                locationID: location,
            });

            const mappedResults: Tour[] = results.map((item: any) => ({
                arrival: `${item.Arrival_Date.split("T")[0]} ${item.Arrival_Time}`,
                customer: item.Customer || "Unknown",
                tourId: String(item.Tour_Id),
                subProgram: item.Sub_Program || "N/A",
                premium: `$${item.Premium.toFixed(2)}`,
                refund: `$${item.Refund.toFixed(2)}`,
                tourStatus: item.Tour_Status || "Pending",
                gcNumber: item.GC_Number || "N/A",
                cardStatus: item.Card_Status || "N/A",
            }));

            setTourList(mappedResults);
        } catch (error) {
            console.error("Error fetching tour list:", error);
        }
    };

    useEffect(() => {
        fetchTourList();
    }, [location, date]);

    useEffect(() => {
        const handleStorageChange = () => {
            setLocation(getStoredLocation());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <div className="mx-8">
            <section className="tour-section">
                <div className="tour-date-picker">
                    <input
                        style={{
                            paddingRight: "10%",
                            fontSize: "x-large",
                            textAlign: "center",  // Centers text inside the input
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0 auto", // Centers the input itself in its container
                        }}
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        aria-label="Select date"
                    />
                </div>
            </section>

            <header className="tour-table-header grid grid-cols-10 justify-center py-2 bg-gray-500 text-white rounded-t-lg font-bold">
                <div>Arrival</div>
                <div>Customer</div>
                <div>Tour ID</div>
                <div>Sub Program</div>
                <div>Premium</div>
                <div>Refund</div>
                <div>Tour Status</div>
                <div>GC Number</div>
                <div>Card Status</div>
                <div>Fund</div>
            </header>

            <main className="tour-content overflow-y-scroll max-h-[60lvh] tour-scroll">
                {filteredTourList.map((value, index) => (
                    <div
                        key={index}
                        className={`tour-table-row grid grid-cols-10 justify-center py-4 ${index % 2 === 0 ? "tour-table-row-alt bg-gray-200" : ""
                            }`}
                    >
                        <div>{value.arrival}</div>
                        <div>{value.customer}</div>
                        <div>{value.tourId}</div>
                        <div>{value.subProgram}</div>
                        <div>{value.premium}</div>
                        <div>{value.refund}</div>
                        <div>{value.tourStatus}</div>
                        <div>{value.gcNumber}</div>
                        <div>{value.cardStatus}</div>
                        <div>
                            <Link
                                to={`/fundCard?customer=${value.customer}&tourId=${value.tourId}&subProgram=${value.subProgram}&premium=${value.premium.replace(
                                    "$",
                                    ""
                                )}&refund=${value.refund.replace("$", "")}`}
                                className="tour-fund-btn"
                            >
                                <img
                                    src="../fund_logo.svg"
                                    alt="Fund Card"
                                    width={25}
                                    className="tour-fund-icon"
                                />
                            </Link>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
