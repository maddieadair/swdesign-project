import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./navbar.js";
import { ReactComponent as ProfileImg } from "./assets/Add-Profile-Picture-2--Streamline-Brooklyn.svg";

async function logout(serverDomain) {
  try {
    const response = await fetch(serverDomain + "/api/logout", {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return true;
  }
  catch (error) {
    console.error("Signout error");
    throw error;
  }
}

export default function Homepage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { loginInfo, profile } = location.state;

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const success = await logout("http://localhost:3001")
      if (success) {
        navigate("/")
      }
    }
    catch(error) {alert(error);}
  };


  return (
    <div>
      <Navbar/>
    <div className="flex justify-center items-center h-screen text-[#153640] selection:bg-[#88BBC8] overflow-auto xl:w-full">
      <div className="flex flex-col xl:flex-row space-y-2 xl:space-x-32 xl:space-y-0 m-12 xl:m-20 gap-y-12 mt-48">
        <div className="flex flex-col justify-center items-center xl:w-2/3">
          <ProfileImg className="h-fit w-1/2 xl:h-fit xl:w-full" />
          <div className="space-y-2">
            <h1 className="font-montserrat text-4xl font-bold xl:text-5xl text-center">
              {profile.fullName}
            </h1>
            <h3 className=" text-center text-2xl">@{loginInfo.username}</h3>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 xl:w-full xl:p-12 xl:rounded-md xl:border-2 xl:border-[#153640] xl:shadow-[10px_10px_0px_0px_rgba(21,54,64)]">
          <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-12">
            <h3 className="font-monsterrat font-bold">username</h3>
            <p>{loginInfo.username}</p>
          </div>
          <hr></hr>
          {/* <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-12">
            <h3 className="font-monsterrat font-bold">password</h3>
            <p>{loginInfo.password}</p>
          </div>
          <hr></hr> */}
          <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-12">
            <h3 className="font-monsterrat font-bold">full name</h3>
            <p>{profile.fullName}</p>
          </div>
          <hr></hr>
          <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-12">
            <h3 className="font-monsterrat font-bold">address line 1</h3>
            <p>{profile.address1}</p>
          </div>
          <hr></hr>
          <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-12">
            <h3 className="font-monsterrat font-bold">address line 2</h3>
            <p>{profile.address2}</p>
          </div>
          <hr></hr>
          <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-12">
            <h3 className="font-monsterrat font-bold">city</h3>
            <p>{profile.city}</p>
          </div>
          <hr></hr>
          <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-12">
            <h3 className="font-monsterrat font-bold">state</h3>
            <p>{profile.state}</p>
          </div>
          <hr></hr>
          <div className="flex flex-col gap-y-2 xl:flex-row xl:gap-x-12">
            <h3 className="font-monsterrat font-bold">zipcode</h3>
            <p>{profile.zipcode}</p>
          </div>
          <div>
            <button
              className="bg-[#153640] text-[#FBFAF5] flex flex-row justify-center items-center gap-x-2 p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
              type="submit"
              onClick={handleLogout}
            >
              logout
          </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
