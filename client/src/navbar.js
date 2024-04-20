import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FaWpforms } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";

export default function Navbar() {
    const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

      try {
        const response = await fetch("http://localhost:3001/api/logout", {
          method: "POST",
          credentials: "include",
        });

        console.log(response);
        if (!response.ok) {
          throw new Error("There was a network error!");
        }

        alert("Successfully logged out!");
        navigate('/')
      } catch (error) {
        alert(error);
        console.log("There was an error fetching:", error);
      }
  };

  return (
    <div className="flex flex-row w-screen bg-[#fafafa] text-[#2f2f28] font-inter h-16 border-b border-[#e2e2e0] items-center justify-between py-2 px-12">
      <button className="font-bold" onClick={handleLogout}>Log out</button>
      <div className="flex flex-row gap-x-6 font-bold items-center">
      <Link to="/form">
          <p>New Fuel Quote Form</p>
        </Link>
        <Link to="/history">
          <p>History</p>
        </Link>
        <Link to="/profile">
          <FaCircleUser size={20} />
        </Link>
        {/* <FaWpforms size={20}/>
            <LuHistory size={20}/>
            <FaCircleUser size={20}/> */}
      </div>
    </div>
  );
}
