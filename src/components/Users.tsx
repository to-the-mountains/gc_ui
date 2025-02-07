import React from "react";
import { useEffect, useState } from "react";
import { getUserList } from "../utils/apiService.tsx";
import { UseUser } from "../utils/userContext.tsx";
import LogInPrompt from "./LogInPrompt.tsx";

export default function Users() {
  const [selection, setSelection] = useState({
    username: "",
    role: "",
    location: "",
    lastname: "",
    firstname: "",
    phone: "",
    email: "",
    active: "",
  });

  const [userList, setUserList] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const fetchUserList = async () => {
    const results = await getUserList();
    const mappedResults = results.map((user: any) => ({
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
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const filteredUserList = userList.filter((user) => {
    // Check if the user matches the filter criteria
    const matchesUsername = user.username.toLowerCase().includes(selection.username.toLowerCase());
    const matchesRole = user.role.toLowerCase().includes(selection.role.toLowerCase());
    const matchesLocation = user.location.toLowerCase().includes(selection.location.toLowerCase());
    const matchesFirstname = user.firstname.toLowerCase().includes(selection.firstname.toLowerCase());
    const matchesLastname = user.lastname.toLowerCase().includes(selection.lastname.toLowerCase());
    const matchesSearchTerm = user.lastname.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply all conditions
    return matchesUsername &&
      matchesRole &&
      matchesLocation &&
      matchesFirstname &&
      matchesLastname &&
      matchesSearchTerm;
  });

  const { user } = UseUser();

    const checkLogin = () => {
        if (user == null) {
            return true;
        }
        else {
            return false;
        }
    }

  return (
    <div className="mx-8">
      <section className="flex justify-end items-center gap-40 h-[25lvh]">
        {/* Search and Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-row-3 gap-2 font-bold">
            <div>Username:</div>
            <div>Role:</div>
            <div>Location:</div>
          </div>
          <div className="grid grid-row-3 gap-2">
            <input
              className="bg-gray-100 rounded p-2"
              type="text"
              placeholder="username"
              value={selection.username}
              onChange={(e) =>
                setSelection({ ...selection, username: e.target.value })
              }
            />
            <select
              className="rounded p-2 bg-gray-100"
              value={selection.role}
              onChange={(e) =>
                setSelection({ ...selection, role: e.target.value })
              }
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="GL">GL</option>
              <option value="User">User</option>
            </select>
            <select
              className="rounded p-2 bg-gray-100"
              value={selection.location}
              onChange={(e) =>
                setSelection({ ...selection, location: e.target.value })
              }
            >
              <option value="">All Locations</option>
              <option value="In House">In House</option>
              <option value="Main Line">Main Line</option>
              <option value="Massanutten">Massanutten</option>
            </select>
          </div>
        </div>

        {/* Firstname and Lastname Filters */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="grid grid-row-2 gap-2 font-bold">
            <div>First Name:</div>
            <div>Last Name:</div>
          </div>
          <div className="grid grid-row-2 gap-2">
            <input
              className="bg-gray-100 rounded p-2"
              type="text"
              placeholder="first name"
              value={selection.firstname}
              onChange={(e) =>
                setSelection({ ...selection, firstname: e.target.value })
              }
            />
            <input
              className="bg-gray-100 rounded p-2"
              type="text"
              placeholder="last name"
              value={selection.lastname}
              onChange={(e) =>
                setSelection({ ...selection, lastname: e.target.value })
              }
            />
          </div>
        </div>
      </section>

      {/* Table Header */}
      <header className="grid user-grid-cols justify-center justify-items-center py-2 bg-gray-400 rounded-t-lg font-bold">
        <div className="">Username</div>
        <div className="">Role</div>
        <div className="">Location</div>
        <div className="">Lastname</div>
        <div className="">Firstname</div>
        <div className="">Phone #</div>
        <div className="">Email</div>
      </header>

      {/* Filtered User List */}
      <main className="overflow-y-scroll max-h-[50lvh] hide-scroll example">
        {filteredUserList.map((user, index) => (
          <section
            key={user.username}
            className={`grid user-grid-cols justify-center justify-items-center py-4 ${
              selection.username === user.username
                ? "bg-blue-300"
                : index % 2 === 0
                ? "bg-gray-200"
                : ""
            }`}
            onClick={() => {
              setSelection((prevState) =>
                prevState.username === user.username
                  ? {
                      username: "",
                      role: "",
                      location: "",
                      lastname: "",
                      firstname: "",
                      phone: "",
                      email: "",
                      active: "",
                    }
                  : {
                      username: user.username,
                      role: user.role,
                      location: user.location,
                      lastname: user.lastname,
                      firstname: user.firstname,
                      phone: user.phone,
                      email: user.email,
                      active: user.active,
                    }
              );
            }}
          >
            <div>{user.username}</div>
            <div>{user.role}</div>
            <div>{user.location}</div>
            <div>{user.lastname}</div>
            <div>{user.firstname}</div>
            <div>{user.phone}</div>
            <div>{user.email}</div>
          </section>
        ))}
      </main>
      <LogInPrompt
                user={user}
                open={checkLogin()}
            />
    </div>
  );
}
