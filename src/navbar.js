import React from "react";
import { MdHistory } from "react-icons/md";
import { BiHome } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaWpforms } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-[#153640] text-[#FBFAF5] font-montserrat font-bold text-lg flex flex-row justify-evenly py-4 xl:h-screen xl:w-fit xl:p-6 xl:flex-col xl:gap-y-12">
      <CgProfile />
      <BiHome />
      <FaWpforms />
      <MdHistory />
    </div>
  );
}
