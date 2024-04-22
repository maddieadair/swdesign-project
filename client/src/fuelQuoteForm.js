import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FaWpforms } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import Navbar from "./navbar.js";
import Loading from "./loading.js";
import { getPrice, getTotal } from "./fuelPriceModule.js";
import { CiRedo } from "react-icons/ci";
import Modal from "./modal.js";

export default function FuelQuoteForm() {
  const [gallons, setGallons] = useState("");
  const [date, setDate] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);

  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [history, setHistory] = useState([]);

  const [showQuote, setShowQuote] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      fetchProfile();
    }, 1000);
  }, []);


  const fetchProfile = () => {
    fetch("http://localhost:3001/api/profile", {
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
        setProfile(data);
        console.log(data);
        setLoading(false);
      });
  };

  const checkHistory = async () => {
    return (fetch("http://localhost:3001/api/check-history", {
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
        console.log(data);
        // setHistory(data)
        return data;
      }).catch((err) => {
        console.log(err)
      })
    )
  };

  const validate = () => {
    setErrors({});
    let errors = {};
    var hasErrors = false;

    if (gallons.length === 0) {
      errors.gallons = "* Please enter a gallon amount of at least 1 gallon.";
      hasErrors = true;
    }

    if (date.length === 0) {
      errors.deliveryDate = "* Please enter a valid delivery date.";
      hasErrors = true;
    }

    setErrors(errors);
    console.log(errors);
    console.log("hasErrrors:", hasErrors);

    return hasErrors;
  };

  const getQuote = async() => {
    let response = await checkHistory();

    let hasHistory = response.length > 0 && response[0].hasHistory === 1 ? 1 : 0;

    const suggested = getPrice(
      profile[0].State,
      gallons,
      hasHistory
    );
    setSuggestedPrice(suggested);

    const total = getTotal(gallons, suggested);
    setTotalPrice(total);
    setShowQuote(true);
  };

  const resetFields = () => {
    setGallons("");
    setDate("");

    setSuggestedPrice("");
    setTotalPrice("");
    setErrors({});
    setShowQuote(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasErrors = validate();

    const address1 = profile[0].Address1;
    const address2 = profile[0].Address2 !== null ? profile[0].Address2 : "";
    const city = profile[0].City;
    const state = profile[0].State;
    const zipcode = profile[0].Zipcode;

    let address = "";

    if (address2 === "") {
      address = address1 + ", " + city + ", " + state + " " + zipcode;
    } else {
      address =
        address1 + ", " + address2 + ", " + city + ", " + state + " " + zipcode;
    }
    console.log(address);
    if (!hasErrors) {
      console.log("No errors detected");

      const userData = {
        gallons: gallons,
        deliveryAddress: address,
        deliveryDate: date,
        suggestedPrice: suggestedPrice,
        totalBill: totalPrice,
      };

      console.log("userData", userData);

      try {
        const response = await fetch("http://localhost:3001/api/fuel-quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        });

        console.log(response);
        if (!response.ok) {
          throw new Error("There was a network error!");
        }

        const data = await response.json();
        console.log(data);


        setModalMessage("Fuel Quote successfully added!")
        setOpenModal(true);

        // alert("Fuel Quote successfully added!");
        resetFields();
      } catch (error) {
        setModalMessage(error.message)
        setOpenModal(true);
        // alert(error);
        console.log("There was an error fetching:", error);
      }
    } else {
      console.log("Input is not valid");
    }
  };

  const handleGallonChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setGallons(value);
  };

  console.log("delivery date", date);
  console.log("delivery date type", typeof date);
  console.log("delivery date length", date.length);
  console.log("gallons", gallons);
  console.log("gallons length", gallons.length);
  console.log("gallons type", typeof gallons);
  console.log(parseInt(gallons));

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      {!loading ? (
        <div className="flex flex-col min-h-screen">
          <Modal open={openModal} onClose={handleClose}>
            <p className="font-inter">{modalMessage}</p>
          </Modal>
          <Navbar />
          <div className="flex flex-col gap-y-16 font-inter px-16 py-24">
            <div className="text-start flex flex-col gap-y-12">
              <h1 className="font-alegreya text-7xl font-bold">
                Fuel Quote Form
              </h1>
              <div className="flex flex-col">
                <p className="font-bold">Looking to get a new fuel quote?</p>
                <p>Just fill out a few details to get your quote.</p>
              </div>
            </div>

            <form className="flex flex-row gap-x-20" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-y-12 text-start w-1/2">
                <div className="flex flex-col gap-y-12">
                  <div className="flex flex-col gap-y-4">
                    <h5 className="font-bold">
                      # of Gallons <span className="text-red-400">*</span>
                    </h5>
                    <input
                      type="text"
                      name="gallons"
                      placeholder="Gallons"
                      value={gallons}
                      onChange={(e) => handleGallonChange(e)}
                      disabled={showQuote}
                      className="text-[#2f2f28] disabled:cursor-not-allowed border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                    />
                    {errors.gallons ? (
                      <p className="text-red-400">{errors.gallons}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-y-4">
                    <h5 className="font-bold">
                      Delivery Date <span className="text-red-400">*</span>
                    </h5>{" "}
                    <input
                      type="date"
                      min={new Date().toJSON().slice(0, 10)}
                      name="deliveryDate"
                      placeholder="Delivery Date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled={showQuote}
                      className="text-[#2f2f28] disabled:cursor-not-allowed border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                    />
                    {errors.deliveryDate ? (
                      <p className="text-red-400">{errors.deliveryDate}</p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-row gap-x-2">
                  <button
                    type="button"
                    className="p-4 font-bold w-1/2 bg-[#953327] rounded-md text-[#fafafa] hover:bg-[#c3483c] transition-colors ease-in-out duration-500"
                    onClick={resetFields}
                  >
                    Reset Fields
                  </button>

                  <button
                    type="button"
                    onClick={getQuote}
                    disabled={
                      date.length === 0 ||
                      isNaN(gallons) ||
                      gallons.length === 0 ||
                      showQuote
                    }
                    className="w-1/2 font-bold bg-[#0b3721] rounded-md p-4 text-[#fafafa] hover:bg-[#3d7b52] transition-colors ease-in-out duration-500 disabled:bg-[#fafafa] disabled:text-slate-500 disabled:border-[#e2e2e0] disabled:border disabled:cursor-not-allowed"
                  >
                    Get Quote
                  </button>
                </div>
              </div>

              <div className="w-1/2 flex flex-col text-start gap-y-6">
                <div className="border-b pb-6">
                  <h1 className="font-bold text-lg">Delivery Address</h1>
                  <p>{profile[0].Address1}</p>
                  <p>{profile[0].Address2}</p>
                  <p>
                    {profile[0].City}, {profile[0].State} {profile[0].Zipcode}
                  </p>
                </div>
                {showQuote ? (
                  <div className="flex flex-col gap-y-8">
                    <div className="flex flex-col gap-y-6">
                      <div className="flex flex-row gap-x-2">
                        <p className="font-bold">
                          Suggested Price per Gallon:{" "}
                        </p>
                        <p>${suggestedPrice}</p>
                      </div>
                      <div className="flex flex-row gap-x-2">
                        <p className="font-bold">Total Amount Due: </p>
                        <p>
                          ${(Math.round(totalPrice * 100) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={gallons.length === 0 || date.length === 0}
                      className="font-bold bg-[#0b3721] rounded-md p-4 text-[#fafafa] hover:bg-[#3d7b52] transition-colors ease-in-out duration-500 disabled:bg-[#fafafa] disabled:text-slate-500 disabled:border-[#e2e2e0] disabled:border disabled:cursor-not-allowed"
                    >
                      Submit
                    </button>{" "}
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
