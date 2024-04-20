import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FaWpforms } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import Navbar from "./navbar.js";
import Loading from "./loading.js";

export default function FuelQuoteHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      fetchProfile();
    }, 1000);
  }, []);

  const fetchProfile = () => {
    fetch("http://localhost:3001/api/fuel-quote", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setHistory(data);
        console.log(data);
        setLoading(false);
      });
  };

  return (
    <>
      {!loading ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-col gap-y-20 font-inter px-16 py-24">
            <div className="text-start flex flex-col">
              <h1 className="font-alegreya text-7xl font-bold">
                Fuel Quote History
              </h1>
            </div>

            {history.length > 0 ? (
              <div className="bg-white rounded-md h-fit flex flex-col divide-y-2 divide-slate-100 border text-start">
                <div className="flex flex-row gap-x-6 font-bold p-6 px-10 items-center justify-between bg-[#f4f4f4] rounded-t-md">
                  <p className="w-1/5">Gallons Requested</p>
                  <p className="w-1/5">Delivery Address</p>
                  <p className="w-1/5">Delivery Date</p>
                  <p className="w-1/5">Suggested Price</p>
                  <p className="w-1/5">Total Amount Due</p>
                </div>
                {history.map((item, id) => (
                  <div
                    key={id}
                    className="flex flex-row gap-x-6 p-6 group px-10"
                  >
                    <p className="w-1/5 ">{item.Gallons_Requested}</p>
                    <p className="w-1/5 ">{item.Delivery_Address}</p>
                    <p className="w-1/5 ">{item.New_Date}</p>
                    <p className="w-1/5 ">${item.Suggested}</p>
                    <p className="w-1/5 ">${item.Total}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-start">Nothing to see here!</p>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
