import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./navbar.js";
// import { BsiuelPumpFill } from "react-icons/bs";
import { BsFuelPumpFill } from "react-icons/bs";
import { FaLocationArrow, FaUser, FaCalendar} from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";

export default function FuelQuoteHistory() {
  const TABLE_HEAD = [
    {
     attr: "Gallons Requested",
     icon: <BsFuelPumpFill/>},
    {
     attr: "Delivery Address",
     icon: <FaLocationArrow/>
    },
    {
      attr: "Date (MM/DD/YY)",
      icon: <FaCalendar/>
    },
    {
      attr: "Suggested Price",
      icon: <IoIosPricetags/>
    },
    { attr: "Total Amount",
      icon: <IoIosPricetags/>}];
  const TABLE_ROWS = [
    {
        gallons: 100,
        address: "123 Baker Street",
        date: "9-14-23",
        price: 400.0,
        total_amt: 450.0,
    },
    {
        gallons: 90,
        address: "123 Baker Street",
        date: "9-14-23",
        price: 400.0,
        total_amt: 450.0,
    },
    {
        gallons: 80,
        address: "123 Baker Street",
        date: "9-14-23",
        price: 400.0,
        total_amt: 450.0,
    },
    {
        gallons: 70,
        address: "123 Baker Street",
        date: "9-14-23",
        price: 400.0,
        total_amt: 450.0,
    },
    {
        gallons: 60,
        address: "123 Baker Street",
        date: "9-14-23",
        price: 400.0,
        total_amt: 450.0,
    },
    {
        gallons: 50,
        address: "123 Baker Street",
        date: "9-14-23",
        price: 400.0,
        total_amt: 450.0,
    },
    {
        gallons: 40,
        address: "123 Baker Street",
        date: "9-14-23",
        price: 400.0,
        total_amt: 450.0,
    }
  ];
  return (
    <div>
      <Navbar/>
      <div className="flex flex-col justify-center items-center h-screen selection:bg-[#88BBC8] overflow-auto xl:w-full">
        <h1 className="xl:text-xl font-monsterrat justify-start items-start lowercase">Fuel Quote History</h1>
            <div className="xl:basis-3/4 space-y-8 xl:p-16 xl:rounded-md xl:border-2 xl:border-[#153640] shadow-[10px_10px_0px_0px_rgba(21,54,64)]">
                <table className="w-full min-w-max items-center border border-y-8 border-collapse table-auto border-[#153640] font-monsterrat">
                    <thead>
                      <tr>
                        {TABLE_HEAD.map(({attr, icon}) => (
                          <th key={attr} className="lowercase font-monsterrat text-lg p-3.5">
                            <div className="flex items-center"><div className="mr-3">{icon}</div>{attr}</div></th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_ROWS.map(({gallons, address, date, price, total_amt}, index) => {
                        const rowClasses = `text-4l lowercase border-y-4 border-[#153640]  font-monsterrat text-center transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640] p-4 ${index % 2 === 0 ? "bg-[#9fc0c6]" : ""}`;
                      return(
                        <tr key="test" className="p-4">
                            <td className={rowClasses}>
                            {gallons} gal
                            </td>
                            <td className={rowClasses}>
                            {address}
                            </td>
                            <td className={rowClasses}>
                            {date}
                            </td>
                            <td className={rowClasses}>
                            ${price}
                            </td>
                            <td className={rowClasses}>
                            ${total_amt}
                            </td>
                        </tr>
                      )
                    })}
                    </tbody>
                </table>

                <button
                    className="bg-[#153640] text-[#FBFAF5] flex flex-row justify-center items-center gap-x-2 p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
                    type="submit">
                    make a quote
                </button>
            </div>
        </div>
    </div>
  );
}
