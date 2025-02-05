import { Link, useLocation } from "react-router-dom";
import { updateLocation } from "../utils/apiService.tsx";
import { logoutUser } from "../utils/loginUser.tsx";
import React from "react";
import "../styles/Header.css"; // Import the CSS file

export default function Header() {
  const route = useLocation();
  const hideElements = route.pathname === "/"; // Hide when on login page or root
  const inititalLocation = localStorage.getItem('location') || "22"

  async function handleLocation(location: string) {
    const locationNumber = Number(location);

    localStorage.setItem("location", locationNumber.toString());

    const event = new StorageEvent("storage", {
      key: "location",
      newValue: locationNumber.toString(),
    });
    window.dispatchEvent(event);

    const userId = localStorage.getItem("username");
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    let data = {
      username: userId,
      location: locationNumber,
    };

    updateLocation(data);
  }

  return (
    <header className="header">
      {/* Top header section with logo and user info */}
      <main className="header-top">
        <Link className="header-logo" to={"/"}>
          <img src="../gift_card_logo.svg" width={150} alt="gift-card-logo" />
          <div className="header-logo-text">Gift Card Activator</div>
        </Link>

        {!hideElements && ( // Hide location selector when on login page
          <div className="user-info">
            <select className="location-selector" onChange={(event) => handleLocation(event.target.value)} defaultValue={inititalLocation}>
              <option value={22}>Main Line</option>
              <option value={23}>In House</option>
              {/* <option value={24}>Massanutten</option> */}
            </select>
            <div>
              <button className="logout-button" onClick={logoutUser}>Logout</button>
            </div>
          </div>
        )}
      </main>

      {/* Header tabs section */}
      {!hideElements && ( // Hide navigation tabs when on login page
        <section className="nav-tabs">
          <Link className={route.pathname === "/tour" ? "active" : ""} to="/tour">
            Tour
          </Link>
          <Link className={route.pathname === "/funding" ? "active" : ""} to="/funding">
            Funding
          </Link>
        </section>
      )}
    </header>
  );
}
