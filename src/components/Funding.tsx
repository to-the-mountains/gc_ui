import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFundingList } from "../utils/apiService.tsx";
import { Link } from "react-router";
import React from "react";
import '../styles/Funding.css'; // Import the CSS file

const safeLocalStorageGet = (key: string, defaultValue: string): string => {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch (error) {
        console.error(`Error accessing localStorage for key "${key}":`, error);
        return defaultValue;
    }
};

export default function Funding() {
    type fundingInfo = {
        gcNumber: string;
        customer: string;
        tourId: string;
        subProgram: string;
        amount: string;
        premium: string;
        refund: string;
        balance: string;
        cardStatus: string;
    };

    const navigate = useNavigate();
    const [username] = useState(safeLocalStorageGet("username", "defaultUsername"));
    const [fundingList, setFundingList] = useState<fundingInfo[]>([]);
    const [filteredFundingList, setFilteredFundingList] = useState<fundingInfo[]>([]);

    const [location, setLocation] = useState<number>(() => {
        return parseInt(safeLocalStorageGet("location", "22"));
    });

    useEffect(() => {
        const storedLocation = localStorage.getItem("location");
        if (!storedLocation) {
            navigate("/funding");
        }
    }, [navigate]);

    const formatDate = (date: Date): string => {
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0];
        return localDate;
    };

    const [date, setDate] = useState<string>(() => {
        const today = new Date();
        return formatDate(today);
    });

    const [filters, setFilters] = useState({
        showUnfundedCards: true,
        showFundedCards: true,
        showZeroPurseTransactions: true,
        showVoidTransTransactions: true,
    });

    const fetchFundingList = async () => {
        const results = await getFundingList({
            username: username,
            date: date,
            locationID: location,
        });
        const mappedResults: fundingInfo[] = results.map((item: any) => ({
            gcNumber: item.GC_Number || "Unknown",
            customer: item.Customer || "Unknown",
            tourId: String(item.Tour_id) || null,
            subProgram: item.Sub_Program || "N/A",
            amount: `$${item.Amount}.00` || null,
            premium: `$${item.Premium}.00` || null,
            refund: `$${item.Refund}.00` || null,
            balance: `$${item.Balance}.00` || null,
            cardStatus: item.Status || null,
        }));

        setFundingList(mappedResults);
        setFilteredFundingList(mappedResults);
    };

    useEffect(() => {
        const filtered = fundingList.filter((item) => {
            if (!filters.showUnfundedCards && item.cardStatus === "Created") return false;
            if (!filters.showFundedCards && item.cardStatus === "Funded") return false;
            if (
                !filters.showZeroPurseTransactions &&
                item.cardStatus === "Funded" &&
                item.balance === null
            )
                return false;
            if (!filters.showVoidTransTransactions && item.cardStatus === "Voided") return false;

            return true;
        });
        setFilteredFundingList(filtered);
    }, [filters, fundingList]);

    useEffect(() => {
        fetchFundingList();
    }, [location, date]);

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

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };

    const handleFilterChange = (filterName: keyof typeof filters) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: !prev[filterName],
        }));
    };

    return (
        <div className="mx-8">
            <section className="funding-section">
                <div className="funding-date-picker">
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
                        onChange={handleDateChange}
                        value={date}
                    />

                </div>
                <div className="funding-filters-column" style={{marginRight:"-3%", marginTop: '.5%'}}>
                    <div>
                        <input
                            type="checkbox"
                            id="showUnfundedCards"
                            checked={filters.showUnfundedCards}
                            onChange={() => handleFilterChange("showUnfundedCards")}
                        />
                        <label htmlFor="showUnfundedCards">Show Unfunded Cards</label>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="showFundedCards"
                            checked={filters.showFundedCards}
                            onChange={() => handleFilterChange("showFundedCards")}
                        />
                        <label htmlFor="showFundedCards">Show Funded Cards</label>
                    </div>
                </div>
                <div className="funding-filters-column" style={{ marginTop: '.5%'}}>
                    <div>
                        <input
                            type="checkbox"
                            id="showZeroPurseTransactions"
                            checked={filters.showZeroPurseTransactions}
                            onChange={() => handleFilterChange("showZeroPurseTransactions")}
                        />
                        <label htmlFor="showZeroPurseTransactions">
                            Show Zero Purse Transactions
                        </label>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="showVoidTransTransactions"
                            checked={filters.showVoidTransTransactions}
                            onChange={() => handleFilterChange("showVoidTransTransactions")}
                        />
                        <label htmlFor="showVoidTransTransactions">
                            Show Void Trans Transactions
                        </label>
                    </div>
                </div>
                <div className="funding-button">
                    <Link to="/fundCard">
                        <button className="funding-button-style">Create and Fund Card</button>
                    </Link>
                </div>

            </section>

            <header className="funding-header-grid">
                <div>GC Number</div>
                <div>Customer</div>
                <div>Tour ID</div>
                <div>Sub Program</div>
                <div>Amount</div>
                <div>Premium</div>
                <div>Refund</div>
                <div>Balance</div>
                <div>Status</div>
                {/* <div>Edit</div> */}
                <div>View</div>
                <div>Void</div>
            </header>

            <main className="scrollable-funding-list hide-scroll">
                {filteredFundingList.map((value, index) => (
                    <div
                        key={index}
                        className={`funding-item-grid ${index % 2 === 0 ? "funding-item-grid-alt" : ""
                            }`}
                    >
                        <div>{value.gcNumber}</div>
                        <div>{value.customer}</div>
                        <div>{value.tourId}</div>
                        <div>{value.subProgram}</div>
                        <div>{value.amount}</div>
                        <div>{value.premium}</div>
                        <div>{value.refund}</div>
                        <div>{value.balance}</div>
                        <div>{value.cardStatus}</div>
                        {/* <Link to={`/viewInfo?gc=${value.gcNumber}`}>
              <img src="../edit.svg" width={25} alt="" />
            </Link> */}
                        <Link to={`/viewInfo?gc=${value.gcNumber}`}>
                            <img src="../magnifying_glass.svg" width={25} alt="" />
                        </Link>
                        <Link to={`/voidCard?gc=${value.gcNumber}&customer=${value.customer}`}>
                            <img src="../cancel.svg" width={25} alt="" />
                        </Link>
                    </div>
                ))}
            </main>
        </div>
    );
}
