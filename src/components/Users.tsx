import { useEffect, useState, useMemo } from "react";
import React from "react";
import { getUserList } from "../utils/apiService.tsx";
import LogInPrompt from "./LogInPrompt.tsx";
import { UseUser } from "../utils/userContext.tsx";
import "../styles/Users.css";
import { Link } from "react-router-dom";

export default function Users() {
  type User = {
    username: string;
    role: string;
    location: string;
    lastname: string;
    firstname: string;
    phone: string;
    email: string;
    active: string;
  };

  const [userList, setUserList] = useState<User[]>([]);
  const [searchFields, setSearchFields] = useState<{ [key in keyof User]?: string }>({});
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { user } = UseUser();
  const currentUserRole = localStorage.getItem("role") || "user";
  const isAdmin = currentUserRole === "admin";

  const fetchUserList = async () => {
    try {
      const results = await getUserList();
      const mappedResults: User[] = results.map((user: any) => ({
        username: user.UserName,
        role: user.Role,
        location: user.Location,
        lastname: user.LastName,
        firstname: user.FirstName,
        phone: user.Phone,
        email: user.Email,
        active: user.Active.toString(),
      }));
      setUserList(mappedResults);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleSort = (field: keyof User) => {
    setSortOrder((prevOrder) => (sortField === field && prevOrder === "asc" ? "desc" : "asc"));
    setSortField(field);
  };

  const handleSearchChange = (field: keyof User, value: string) => {
    setSearchFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDropdownChange = (field: keyof User, value: string) => {
    setSearchFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const sortedUserList = useMemo(() => {
    const sorted = [...userList].sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [userList, sortField, sortOrder]);

  const filteredUserList = useMemo(() => {
    return sortedUserList.filter((user) =>
      Object.keys(searchFields).every((key) => {
        const fieldKey = key as keyof User;
        // Default to an empty string if searchFields[fieldKey] is undefined or null
        const searchValue = (searchFields[fieldKey] || "").toLowerCase();
        return user[fieldKey]?.toLowerCase().includes(searchValue);
      })
    );
  }, [searchFields, sortedUserList]);


  // Get unique roles and locations for dropdown options
  const uniqueRoles = [...new Set(userList.map(user => user.role))];
  const uniqueLocations = [...new Set(userList.map(user => user.location))];

  return (
    <div className="mx-8">
      <section className="user-section">
        <div className="search-group">
          {["username", "firstname", "lastname"].map((field) => (
            <div key={field} className="search-inputs">
              <input
                type="text"
                value={searchFields[field as keyof User] || ""}
                placeholder={`Search by ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                onChange={(e) => handleSearchChange(field as keyof User, e.target.value)}
                aria-label={`Search by ${field}`}
                className="search-bar"
              />
            </div>
          ))}
        </div>

        <div className="search-group">
          {["phone", "email"].map((field) => (
            <div key={field} className="search-inputs">
              <input
                type="text"
                value={searchFields[field as keyof User] || ""}
                placeholder={`Search by ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                onChange={(e) => handleSearchChange(field as keyof User, e.target.value)}
                aria-label={`Search by ${field}`}
                className="search-bar"
              />
            </div>
          ))}
        </div>

        {/* Role and Location Dropdowns */}
        <div className="search-group">
          <div className="search-input">
            <select
              value={searchFields["role"] || ""}
              onChange={(e) => handleDropdownChange("role", e.target.value)}
              aria-label="Search by Role"
              className="search-bar"
            >
              <option value="">Select Role</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="search-input">
            <select
              value={searchFields["location"] || ""}
              onChange={(e) => handleDropdownChange("location", e.target.value)}
              aria-label="Search by Location"
              className="search-bar"
            >
              <option value="">Select Location</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="search-group">
          <div className="search-input">
          {isAdmin ? (
              <Link to="/adduser">
                <button className="add-user-button-style">Add User</button>
              </Link>
            ) : (
              <button className="add-user-button-style-disabled" disabled>
                Add User
              </button>
            )}
          </div>
        </div>
      </section>

      <header className="user-table-header grid grid-cols-8 justify-center py-2 bg-gray-500 text-white rounded-t-lg font-bold">
        {["username", "role", "location", "lastname", "firstname", "phone", "email", "active"].map((field) => (
          <div
            key={field}
            className="cursor-pointer"
            onClick={() => handleSort(field as keyof User)}
            style={{ cursor: "pointer" }}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {sortField === field ? (sortOrder === "asc" ? " ▲" : " ▼") : ""}
          </div>
        ))}
      </header>

      <main className="user-content overflow-y-scroll max-h-[60lvh] user-scroll">
        {filteredUserList.map((user, index) => (
          <div
            key={user.username}
            className={`user-table-row grid grid-cols-8 justify-center py-4 ${index % 2 === 0 ? "user-table-row-alt bg-gray-200" : ""
              }`}
          >
            <div>{user.username}</div>
            <div>{user.role}</div>
            <div>{user.location}</div>
            <div>{user.lastname}</div>
            <div>{user.firstname}</div>
            <div>{user.phone}</div>
            <div>{user.email}</div>
            <div>{user.active === "true" ? "Active" : "Inactive"}</div>
          </div>
        ))}
      </main>

      <LogInPrompt user={user} open={user == null} />
    </div>
  );
}
