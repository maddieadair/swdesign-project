import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./navbar.js";
// import { BsiuelPumpFill } from "react-icons/bs";
import { BsFuelPumpFill } from "react-icons/bs";
import { FaLocationArrow, FaUser, FaCalendar} from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";

async function fetchHistory(serverDomain) {
  try {
    const response = await fetch(`${serverDomain}/api/fuel-quote`, {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data["History"];
    return data.history;
  }
  catch (error) {
    alert(error.name + " was my error ");
    console.error("There was an error fetching the resource.", error);
    throw error;
  }
}

export default function FuelQuoteHistory() {
  const [TABLE_ROWS, SET_TABLE_ROWS] = useState(null);
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
  useEffect(() => {
      const fetchHistoryData = async () => {
        try {
          const serverDomain = "http://localhost:3001"
          const historyData = await fetchHistory(serverDomain);
          SET_TABLE_ROWS(historyData);
        }
        catch (error) {
          console.error('Error fetching history data:', error);
        }
      };
      fetchHistoryData();
      return () => {};
  }, []);

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
                  {TABLE_ROWS && (
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
                  )}
                </table>

            <Link to="/fuelQuoteForm" style={{"display" : "block"}}>
                <button
                    className="bg-[#153640] text-[#FBFAF5] flex flex-row justify-center items-center gap-x-2 p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
                    type="submit">
                    make a quote
                </button>
            </Link>
            </div>
        </div>
    </div>
  );
}
