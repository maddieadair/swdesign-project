import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "./navbar.js";

export default function Quote() {
  const [quoteText, setQuoteText] = useState({
    Gallons: "",
    Date: "",
    Address: "Comes from User Profile (non-editable)",
    PerGallon: 4.29,
  });

  const [errors, setErrors] = useState({});

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
    console.log(quoteText.Gallons);
    if (quoteText.Gallons.length === 0) {
      errors.Gallons = "Please enter a number.";
      hasErrors = true;
    }
    if (quoteText.Date.length === 0) {
      errors.Date = "Please select a date.";
      hasErrors = true;
    }
    console.log(hasErrors);
    setErrors(errors);

    return hasErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors = validate();
  };

  const calculateTotalAmountDue = () => {
    const gallonValue = parseFloat(quoteText.Gallons);
    if (!isNaN(gallonValue)) {
      const totalAmountDue = quoteText.PerGallon * gallonValue;
      return ` Total Amount Due: $${totalAmountDue.toFixed(2)}`;
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
                    placeholder="How Many Gallons?"
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
                  <input
                    type="number"
                    name="PerGallon"
                    placeholder="PerGallon"
                    value={quoteText.PerGallon}
                    readOnly
                    onChange={Quotechange}
                    className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                    style={{ fontStyle: "italic" }}
                  ></input>
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
                  className="bg-[#153640] text-[#FBFAF5] flex flex-row justify-center items-center gap-x-2 p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Purchase
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
