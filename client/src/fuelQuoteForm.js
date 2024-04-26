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
import { useSessionExpirationChecker } from "./sessionExpiration.js";
import { HiPencil } from "react-icons/hi2";

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

  const [editAddy, setEditAddy] = useState(false);
  const [profileValues, setProfileValues] = useState({
    address1: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const handleProfileChange = (e) => {
    setProfileValues((prevState) => ({
      ...profileValues,
      [e.target.name]: e.target.value,
    }));
  };

  const validateAddress = () => {
    console.log("PROFILE VALUES", profileValues);
    setErrors({});
    let errors = {};
    var hasErrors = false;

    if (profileValues.address1.length === 0) {
      errors.address1 = "* Please enter a valid address.";
      hasErrors = true;
    } else if (profileValues.address1 > 100) {
      errors.address1 = "* Address cannot exceed 100 characters.";
      hasErrors = true;
    }

    if (profileValues.city.length === 0) {
      errors.city = "* Please enter a valid city.";
      hasErrors = true;
    } else if (profileValues.city.length > 100) {
      errors.city = "* City cannot exceed 100 characters.";
      hasErrors = true;
    }

    if (profileValues.state.length === 0) {
      errors.state = "* Please choose a state.";
      hasErrors = true;
    }

    if (!isNaN(profileValues.zipcode)) {
      if (profileValues.zipcode.length < 5) {
        errors.zipcode =
          "* Please enter a valid zipcode of at least 5 characters.";
        hasErrors = true;
      } else if (profileValues.zipcode.length > 9) {
        errors.zipcode = "* Zipcode cannot exceed 9 characters.";
        hasErrors = true;
      }
    } else {
      errors.zipcode = "* Please enter a valid zipcode.";
      hasErrors = true;
    }

    setErrors(errors);
    console.log(errors);
    console.log(profileValues);
    console.log("hasErrrors:", hasErrors);

    return hasErrors;
  };

  const handleCancel = () => {
    console.log("IN cancel:", profile[0].Address2);
    setEditAddy(false);
    setProfileValues((prevState) => ({
      ...prevState,
      address1: "",
      city: "",
      state: "",
      zipcode: "",
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const hasErrors = validateAddress();

    if (!hasErrors) {
      console.log("No errors detected");
      const updatedProfile = [...profile];
      console.log("values:");
      console.log(profileValues);

      // Modify the copy with the updated values
      updatedProfile[0].Address1 = profileValues.address1;
      updatedProfile[0].City = profileValues.city;
      updatedProfile[0].State = profileValues.state;
      updatedProfile[0].Zipcode = profileValues.zipcode;

      // Set the modified copy back to the state
      setProfile(updatedProfile);
      console.log("update profile");
      console.log(profile);
      setEditAddy(false);
    } else {
      console.log("Input is not valid");
    }
  };

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
        console.log("profile info");
        console.log(data);
        setLoading(false);
        if (Array.isArray(data) && data.length === 0) {
          setModalMessage("Please create a profile");
          setOpenModal(true);
          setLoading(true);
        }
      });
  };

  const checkHistory = async () => {
    return fetch("http://localhost:3001/api/check-history", {
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
      })
      .catch((err) => {
        console.log(err);
      });
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

  const getQuote = async () => {
    let response = await checkHistory();

    let hasHistory =
      response.length > 0 && response[0].hasHistory === 1 ? 1 : 0;

    const suggested = getPrice(profile[0].State, gallons, hasHistory);
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

        setModalMessage("Fuel Quote successfully added!");
        setOpenModal(true);

        // alert("Fuel Quote successfully added!");
        resetFields();
      } catch (error) {
        setModalMessage(error.message);
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

  const editAddress = async () => {
    setShowQuote(false)
    setEditAddy(true);
    resetFields();
    setProfileValues((prevState) => ({
      ...prevState,
      address1: profile[0].Address1,
      city: profile[0].City,
      state: profile[0].State,
      zipcode: profile[0].Zipcode,
    }));
  };

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
                {editAddy ? (
                  <form className="flex flex-col gap-y-12 text-start">
                    <div className="flex flex-row gap-x-4">
                      <div className="flex flex-col gap-y-2 w-[100%]">
                        <h5 className="font-bold">
                          Address <span className="text-red-400">*</span>
                        </h5>{" "}
                        <input
                          type="text"
                          name="address1"
                          value={profileValues.address1}
                          onChange={handleProfileChange}
                          placeholder="address line 1"
                          className="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                        />
                        {errors.address1 ? (
                          <p className="text-red-400">{errors.address1}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-y-2 w-[100px]">
                        <h5 className="font-bold">
                          State <span className="text-red-400">*</span>
                        </h5>{" "}
                        <select
                          name="state"
                          placeholder="state"
                          value={profileValues.state}
                          onChange={handleProfileChange}
                          className="text-[#2f2f28] border bg-[#fafafa]  border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                        >
                          <option
                            value=""
                            disabled
                            hidden
                            selected
                            className=""
                          >
                            State
                          </option>
                          <option value="AL">AL</option>
                          <option value="AK">AK</option>
                          <option value="AR">AR</option>
                          <option value="AZ">AZ</option>
                          <option value="CA">CA</option>
                          <option value="CO">CO</option>
                          <option value="CT">CT</option>
                          <option value="DC">DC</option>
                          <option value="DE">DE</option>
                          <option value="FL">FL</option>
                          <option value="GA">GA</option>
                          <option value="HI">HI</option>
                          <option value="IA">IA</option>
                          <option value="ID">ID</option>
                          <option value="IL">IL</option>
                          <option value="IN">IN</option>
                          <option value="KS">KS</option>
                          <option value="KY">KY</option>
                          <option value="LA">LA</option>
                          <option value="MA">MA</option>
                          <option value="MD">MD</option>
                          <option value="ME">ME</option>
                          <option value="MI">MI</option>
                          <option value="MN">MN</option>
                          <option value="MO">MO</option>
                          <option value="MS">MS</option>
                          <option value="MT">MT</option>
                          <option value="NC">NC</option>
                          <option value="NE">NE</option>
                          <option value="NH">NH</option>
                          <option value="NJ">NJ</option>
                          <option value="NM">NM</option>
                          <option value="NV">NV</option>
                          <option value="NY">NY</option>
                          <option value="ND">ND</option>
                          <option value="OH">OH</option>
                          <option value="OK">OK</option>
                          <option value="OR">OR</option>
                          <option value="PA">PA</option>
                          <option value="RI">RI</option>
                          <option value="SC">SC</option>
                          <option value="SD">SD</option>
                          <option value="TN">TN</option>
                          <option value="TX">TX</option>
                          <option value="UT">UT</option>
                          <option value="VT">VT</option>
                          <option value="VA">VA</option>
                          <option value="WA">WA</option>
                          <option value="WI">WI</option>
                          <option value="WV">WV</option>
                          <option value="WY">WY</option>
                        </select>
                        {errors.state ? (
                          <p className="text-red-400">{errors.state}</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-row gap-x-4">
                      <div className="flex flex-col gap-y-2 w-1/2">
                        <h5 className="font-bold">
                          City <span className="text-red-400">*</span>
                        </h5>
                        <input
                          type="text"
                          name="city"
                          placeholder="city"
                          value={profileValues.city}
                          onChange={handleProfileChange}
                          className="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                        />
                        {errors.city ? (
                          <p className="text-red-400">{errors.city}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-y-2 w-1/2">
                        <h5 className="font-bold">
                          Zipcode <span className="text-red-400">*</span>
                        </h5>{" "}
                        <input
                          type="text"
                          name="zipcode"
                          value={profileValues.zipcode}
                          onChange={handleProfileChange}
                          placeholder="zipcode"
                          className="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                        />
                        {errors.zipcode ? (
                          <p className="text-red-400">{errors.zipcode}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-row gap-x-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="p-4 font-bold w-1/2 bg-[#953327] rounded-md text-[#fafafa] hover:bg-[#c3483c] transition-colors ease-in-out duration-500"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleUpdate}
                        className="w-1/2 font-bold bg-[#0b3721] rounded-md p-4 text-[#fafafa] hover:bg-[#3d7b52] transition-colors ease-in-out duration-500"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="border-b pb-6">
                    <div className="flex flex-row justify-between">
                      <h1 className="font-bold text-lg">Delivery Address</h1>
                      <button
                        type="button"
                        onClick={editAddress}
                        className="hover:text-[#0b3721] hover:underline hover:underline-offset-4 hover:underline-[#0b3721] transition-all ease-in-out duration-500"
                      >
                        <HiPencil size={20} />
                      </button>
                    </div>
                    <div className="flex flex-col">
                      <p>{profile[0].Address1}</p>
                      <p>{profile[0].Address2}</p>
                      <p>
                        {profile[0].City}, {profile[0].State}{" "}
                        {profile[0].Zipcode}
                      </p>
                    </div>
                  </div>
                )}
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
        <>
          {openModal && (
            <Modal open={openModal} onClose={handleClose}>
              <p className="font-inter">{modalMessage}</p>
            </Modal>
          )}
          <Navbar />
          <Loading />
        </>
      )}
    </>
  );
}
