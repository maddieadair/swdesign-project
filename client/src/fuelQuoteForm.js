import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "./navbar.js";
import { getPrice, getTotal } from "./fuelPriceModule.js";

export default function Quote() {
  const [quoteText, setQuoteText] = useState({
    Gallons: "",
    Date: "",
    Address: "Comes from User Profile (non-editable)",
    PerGallon: 0,
  });

  const [errors, setErrors] = useState({});
  const [temp, setTemp] = useState(0);

  const Quotechange = (e) => {
    setQuoteText((prevState) => ({
      ...quoteText,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    setErrors({});
    let errors = {};
    var hasErrors = false;
    console.log(temp);
    if (quoteText.Gallons === 0) {
      errors.Gallons = "Please enter a number.";
      hasErrors = true;
    }
    if (quoteText.Date.length === 0) {
      errors.Date = "Please select a date.";
      hasErrors = true;
    }
    setErrors(errors);

    return hasErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors = validate();
  };

  const handleGetQuote = (e) => {
    e.preventDefault();

    const suggPrice = getPrice("Texas", quoteText.Gallons, 1);

    setQuoteText((prevState) => ({
      ...prevState,
      PerGallon: suggPrice.toFixed(3),
    }));

    setTemp(quoteText.Gallons);

    const hasErrors = validate();
  };

  const calculateTotalAmountDue = () => {
    if (quoteText.PerGallon != 0 && temp == quoteText.Gallons) {
      const total = getTotal(quoteText.Gallons, quoteText.PerGallon);
      return ` Total Amount Due: $${total.toFixed(2)}`;
    } else if (temp != 0) {
      const total = getTotal(temp, quoteText.PerGallon);
      return ` Total Amount Due: $${total.toFixed(2)}`;
    } else {
      return " Total Amount Due:";
    }
  };

  return (
    <div className="flex flex-col xl:flex-row">
      <Navbar />
      <div className="flex flex-col justify-center items-center flex-grow h-screen xl:basis-1/2 space-y-8 xl:p-16 xl:border-2 xl:border-[#153640] xl:shadow-[10px_10px_0px_0px_rgba(21,54,64)]">
        <div className="xl:basis-1/2 space-y-8 xl:p-16 xl:rounded-md xl:border-2 xl:border-[#153640] xl:shadow-[10px_10px_0px_0px_rgba(21,54,64)]">
          <div className="space-y-4">
            <h1 className="font-montserrat text-4xl font-bold xl:text-5xl">
              Fuel Quote Form
            </h1>
            <h3 className="xl:text-xl">Enter your information below!</h3>
          </div>
          <form className="space-y-16 w-full max-w-xs xl:max-w-2xl">
            <div className="flex xl:flex-row xl:gap-x-12 flex-col gap-y-6 xl:gap-y-0">
              <div className="space-y-6 xl:w-full">
                <div className="flex flex-col gap-y-2 ">
                  <input
                    type="number"
                    name="Gallons"
                    placeholder={`${
                      temp === 0 ? "How Many Gallons?" : `${temp} Gallons`
                    }`}
                    value={quoteText.Gallons}
                    onChange={Quotechange}
                    className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                  ></input>
                  <div className="flex font-bold">
                    <p> Gallons</p>
                  </div>
                  {errors.Gallons && (
                    <p className="text-red-400">{errors.Gallons}</p>
                  )}
                </div>

                <div className="flex flex-col gap-y-2 ">
                  <input
                    type="text"
                    name="Address"
                    placeholder="Address"
                    value={quoteText.Address}
                    readOnly
                    onChange={Quotechange}
                    className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                    style={{ fontStyle: "italic" }}
                  ></input>
                  <div className="flex font-bold">
                    <p> Delivery Address</p>
                  </div>
                </div>

                <div className="flex flex-col gap-y-2 ">
                  <div className="flex flex-row gap-x-4">
                    <input
                      type="number"
                      name="PerGallon"
                      placeholder="Get a Quote!"
                      value={
                        quoteText.PerGallon !== 0 ? quoteText.PerGallon : ""
                      }
                      readOnly
                      onChange={Quotechange}
                      className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8] gap-x-2 w-[100%]"
                    ></input>
                    <div className="flex w-full max-w-[100px] h-[30px]">
                      <button
                        className={`${
                          quoteText.Gallons.length === 0 ||
                          quoteText.Date.length === 0 ||
                          quoteText.Gallons == temp
                            ? "bg-[#88BBC8]"
                            : "bg-[#153640] transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
                        } text-[#FBFAF5] flex flex-row justify-center items-center gap-x-2 p-2 rounded-md w-full font-bold`}
                        type="submit"
                        disabled={
                          quoteText.Date.length.length === 0 ||
                          quoteText.Gallons === 0 ||
                          quoteText.Gallons == temp
                        }
                        onClick={handleGetQuote}
                      >
                        Get Quote
                      </button>
                    </div>
                  </div>
                  <div className="flex font-bold">
                    <p> $ Per Gallon</p>
                  </div>
                </div>

                <div className="flex flex-col gap-y-2 ">
                  <input
                    type="date"
                    name="Date"
                    placeholder=" Date"
                    value={quoteText.Date}
                    onChange={Quotechange}
                    className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                  ></input>
                  <div className="flex font-bold">
                    <p> Date</p>
                  </div>
                  {errors.Date && <p className="text-red-400">{errors.Date}</p>}
                </div>

                <div className="flex font-bold">
                  <p>{calculateTotalAmountDue()}</p>
                </div>

                <button
                  className={`${
                    quoteText.PerGallon === 0
                      ? "bg-[#88BBC8]"
                      : "bg-[#153640] transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
                  } text-[#FBFAF5] flex flex-row justify-center items-center gap-x-2 p-2 rounded-md w-full font-bold`}
                  type="submit"
                  disabled={quoteText.PerGallon === 0}
                  onClick={handleSubmit}
                >
                  Submit Quote
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
