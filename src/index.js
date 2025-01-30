import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Funding from "./components/Funding.tsx";
import FundCard from "./components/FundCard.tsx";
import Login from "./components/Login.tsx";
import ViewInfo from "./components/ViewInfo.tsx";
import VoidCard from "./components/VoidCard.tsx";
import EditInfo from "./components/EditInfo.tsx";
import Tour from "./components/Tour.tsx";
import Header from "./components/Header.tsx"; // Import the Header component
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./utils/userContext.tsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function AppRoutes() {
  const location = useLocation();
  const showHeader = location.pathname !== "/"; // Hide header on login page

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Tour" element={<Tour />} />
        <Route path="/Funding" element={<Funding />} />
        <Route path="/ViewInfo" element={<ViewInfo />} />
        <Route path="/VoidCard" element={<VoidCard />} />
        <Route path="/EditInfo" element={<EditInfo />} />
        <Route path="/FundCard" element={<FundCard />} />
      </Routes>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </UserProvider>
);

reportWebVitals();
