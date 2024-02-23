import React, { useState } from "react";
import { MdHistory } from "react-icons/md";
import { BiHome } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaWpforms } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="bg-[#153640] text-[#FBFAF5] font-montserrat font-bold text-lg flex flex-row justify-evenly py-4 xl:h-screen xl:w-fit xl:p-6 xl:flex-col xl:gap-y-12">
      <Link
        to="/profile"
        className={`hover:bg-[#88BBC8] rounded-xl p-1 ${
          activeLink === "/profile" ? "bg-[#88BBC8]" : ""
        }`}
        onClick={() => handleLinkClick("/profile")}
      >
        <CgProfile />
      </Link>
      <Link
        to="/"
        className={`hover:bg-[#88BBC8] rounded-xl p-1 ${
          activeLink === "/" ? "bg-[#88BBC8]" : ""
        }`}
        onClick={() => handleLinkClick("/")}
      >
        <BiHome />
      </Link>
      <Link
        to="/fuelQuoteForm"
        className={`hover:bg-[#88BBC8] rounded-xl p-1 ${
          activeLink === "/fuelQuoteForm" ? "bg-[#88BBC8]" : ""
        }`}
        onClick={() => handleLinkClick("/fuelQuoteForm")}
      >
        <FaWpforms />
      </Link>
      <Link
        to="/fuelQuoteHistory"
        className={`hover:bg-[#88BBC8] rounded-xl p-1 ${
          activeLink === "/fuelQuoteHistory" ? "bg-[#88BBC8]" : ""
        }`}
        onClick={() => handleLinkClick("/fuel")}
      >
        <MdHistory />
      </Link>
    </div>
  );
}
