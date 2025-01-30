import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTransactionList } from "../utils/apiService.tsx";
import "../styles/ViewInfo.css"; // Import the updated CSS file

export default function ViewInfo() {
    type transactionInfo = {
        gcNumber: string;
        amount: string;
        balance: string;
        transType: string;
        responseCode: string;
        responseDesc: string;
        createdBy: string;
        createdDate: string;
    };

    const [searchParams] = useSearchParams();
    const [transactionList, setTransactionList] = useState<transactionInfo[]>([]);
    const gc = searchParams.get("gc") || "";

    const fetchTransactionList = async () => {
        const results = await getTransactionList({ gc });

        const mappedResults: transactionInfo[] = results.map((item: any) => {
            const rawDate = item.CreateDate;
            const dateTime = rawDate.split("T");
            const utcDate = new Date(`${dateTime[0]}`);
            utcDate.setUTCDate(utcDate.getUTCDate() + 1);

            const date = rawDate
                ? new Intl.DateTimeFormat("en-US", {
                      year: "2-digit",
                      month: "numeric",
                      day: "numeric",
                  }).format(new Date(utcDate))
                : "";

            const time = rawDate
                ? new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: true,
                  }).format(new Date(dateTime[0] + "T" + dateTime[1].split(".")[0]))
                : "";

            const formattedDate = `${date}, ${time}`;

            return {
                gcNumber: gc || "",
                amount:
                    item.Amount !== null && item.Amount !== undefined
                        ? `$${item.Amount}.00`
                        : "$0.00",
                balance:
                    item.Balance !== null && item.Balance !== undefined
                        ? `$${item.Balance}.00`
                        : "$0.00",
                transType: item.TransType || "",
                responseCode: item.Response_Code || "",
                responseDesc: item.Response_Desc || "",
                createdBy: item.CreatedBy || "",
                createdDate: formattedDate,
            };
        });

        setTransactionList(mappedResults);
    };

    useEffect(() => {
        fetchTransactionList();
    }, []);

    return (
        <div className="view-info-container">
            <h1 className="view-info-heading">Gift Card Status</h1>
            <h2 className="view-info-subheading">Bank Card Status</h2>
            <h2 className="view-info-gc-number">GC Number: {gc}</h2>
            
            <div className="view-info-table">
                {/* Table Header */}
                <div className="view-info-header">
                    <div>GC Number</div>
                    <div>Amount</div>
                    <div>Balance</div>
                    <div>Transaction Type</div>
                    <div>Response Code</div>
                    <div>Response Description</div>
                    <div>Created By</div>
                    <div>Created Date</div>
                </div>

                {/* Table Body */}
                <div className="view-info-scroll">
                    {transactionList.map((value, index) => (
                        <div
                            key={index}
                            className={`view-info-row ${index % 2 === 0 ? "view-info-row-alt" : ""}`}
                        >
                            <div>{value.gcNumber}</div>
                            <div>{value.amount}</div>
                            <div>{value.balance}</div>
                            <div>{value.transType}</div>
                            <div>{value.responseCode}</div>
                            <div>{value.responseDesc}</div>
                            <div>{value.createdBy}</div>
                            <div>{value.createdDate}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
