import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FaWpforms } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import { HiPencil } from "react-icons/hi2";
import Navbar from "./navbar.js";
import Loading from "./loading.js";
import { IoMdClose } from "react-icons/io";
import Modal from "./modal.js";

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const [errors, setErrors] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [profileValues, setProfileValues] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      fetchProfile();
    }, 1000);
  }, []);

  const handleProfileChange = (e) => {
    setProfileValues((prevState) => ({
      ...profileValues,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    console.log("PROFILE VALUES", profileValues);
    setErrors({});
    let errors = {};
    var hasErrors = false;

    console.log(profileValues.fullName);
    if (profileValues.fullName.length === 0) {
      errors.fullName = "* Please enter a valid name.";
      hasErrors = true;
    } else if (profileValues.fullName.length > 50) {
      errors.fullName = "* Name cannot exceed 50 characters.";
      hasErrors = true;
    }

    if (profileValues.address1.length === 0) {
      errors.address1 = "* Please enter a valid address.";
      hasErrors = true;
    } else if (profileValues.address1 > 100) {
      errors.address1 = "* Address cannot exceed 100 characters.";
      hasErrors = true;
    }

    console.log("ADDRESS: ", profileValues.address2);
    if (profileValues.address2.length > 100) {
      errors.address2 = "* Address cannot exceed 100 characters.";
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
        console.log("PROFILE", data);

        // setProfileValues((prevState) => ({
        //     ...prevState,
        //     fullName: data.Name !== null || data.Name === undefined ? data.Name : "",
        //     address1: data.Address1 !== null || data.Address1 === undefined ? data.Address1 : "",
        //     address2: data.Address2 !== null || data.Address2 === undefined ? data.Address2 : "bjbjb",
        //     city: data.City !== null || data.City === undefined ? data.City : "",
        //     state: data.State !== null || data.State === undefined ? data.State : "",
        //     zipcode: data.Zipcode !== null || data.Zipdode === undefined ? data.Zipcode : "",
        //   }));

        console.log("PROFILEVALUES after", profileValues);
        setLoading(false);
      });
  };

  const handleEdit = () => {
    console.log("IN EDIT:", profile[0].Address2);
    console.log("in handle edit", profile[0]);
    setOpenEdit(true);
    setProfileValues((prevState) => ({
      ...prevState,
      fullName: profile[0].Name,
      address1: profile[0].Address1,
      address2: profile[0].Address2 === null ? "" : profile[0].Address2,
      city: profile[0].City,
      state: profile[0].State,
      zipcode: profile[0].Zipcode,
    }));
  };

  const handleCancel = () => {
    console.log("IN cancel:", profile[0].Address2);
    setOpenEdit(false);
    setProfileValues((prevState) => ({
      ...prevState,
      fullName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasErrors = validate();

    if (!hasErrors) {
      console.log("No errors detected");
      const userData = {
        name: profileValues.fullName,
        state: profileValues.state,
        city: profileValues.city,
        zipcode: profileValues.zipcode,
        address1: profileValues.address1,
        address2: profileValues.address2,
      };

      console.log("userData", userData);

      try {
        const response = await fetch("http://localhost:3001/api/profile", {
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

        // alert("Profile successfully created!");
        setModalMessage("Profile successfully created!");
        setOpenModal(true);
        setErrors({});
        // window.location.reload();
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    const hasErrors = validate();

    if (!hasErrors) {
      console.log("No errors detected");
      const userData = {
        name: profileValues.fullName,
        state: profileValues.state,
        city: profileValues.city,
        zipcode: profileValues.zipcode,
        address1: profileValues.address1,
        address2: profileValues.address2,
      };

      console.log("userData", userData);

      try {
        const response = await fetch("http://localhost:3001/api/profile", {
          method: "PUT",
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

        setModalMessage("Profile successfully updated!");
        setOpenModal(true);

        // alert("Profile successfully updated!");
        setErrors({});
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
  console.log("profileValues", profileValues);

  const handleClose = () => {
    if (
      modalMessage === "Profile successfully updated!" ||
      modalMessage === "Profile successfully created!"
    ) {
      window.location.reload();
    } else {
      setOpenModal(false);
    }
  };

  return (
    <>
      {!loading ? (
        <div className="flex flex-col min-h-screen gap-y-12">
          <Modal open={openModal} onClose={handleClose}>
            <p className="font-inter">{modalMessage}</p>
          </Modal>
          <Navbar />

          {profile.length === 0 ? (
            <div className="flex flex-col gap-y-12 font-inter px-16 py-24">
              <div className="text-start flex flex-col gap-y-10">
                <h1 className="font-alegreya text-7xl font-bold">Profile</h1>
                <div className="flex flex-col">
                  <p className="font-bold">New Customer?</p>
                  <p>
                    Let's fill out a few more details first before continuing.
                  </p>
                </div>
              </div>

              <form
                className="flex flex-col gap-y-12 text-start"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-row gap-x-4">
                  <div className="flex flex-col gap-y-12 w-1/2">
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">
                        Full Name <span className="text-red-400">*</span>
                      </h5>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="full name"
                        value={profileValues.fullName}
                        onChange={handleProfileChange}
                        class="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                      />
                      {errors.fullName ? (
                        <p className="text-red-400">{errors.fullName}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">
                        Address 1 <span className="text-red-400">*</span>
                      </h5>{" "}
                      <input
                        type="text"
                        name="address1"
                        placeholder="address line 1"
                        value={profileValues.address1}
                        onChange={handleProfileChange}
                        class="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                      />
                      {errors.address1 ? (
                        <p className="text-red-400">{errors.address1}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">Address 2</h5>{" "}
                      <input
                        type="text"
                        name="address2"
                        placeholder="address line 2"
                        value={profileValues.address2}
                        onChange={handleProfileChange}
                        class="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                      />
                      {errors.address2 ? (
                        <p className="text-red-400">{errors.address2}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-12 w-1/2">
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">
                        City <span className="text-red-400">*</span>
                      </h5>
                      <input
                        type="text"
                        name="city"
                        placeholder="city"
                        value={profileValues.city}
                        onChange={handleProfileChange}
                        class="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                      />
                      {errors.city ? (
                        <p className="text-red-400">{errors.city}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-y-2">
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
                        <option value="" disabled hidden selected className="">
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
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">
                        Zipcode <span className="text-red-400">*</span>
                      </h5>{" "}
                      <input
                        type="text"
                        name="zipcode"
                        placeholder="zipcode"
                        value={profileValues.zipcode}
                        onChange={handleProfileChange}
                        class="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                      />
                      {errors.zipcode ? (
                        <p className="text-red-400">{errors.zipcode}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="font-bold bg-[#0b3721] rounded-md p-4 text-[#fafafa] hover:bg-[#3d7b52] transition-colors ease-in-out duration-500"
                >
                  Create Profile
                </button>
              </form>
            </div>
          ) : !openEdit ? (
            <div className="flex flex-col gap-y-12 font-inter px-16 py-24">
              <div className="text-start flex flex-row justify-between items-center">
                <h1 className="font-alegreya text-7xl font-bold">Profile</h1>
                <button onClick={handleEdit}>
                  <HiPencil size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-y-12 text-start">
                <div className="flex flex-row gap-x-4">
                  <div className="flex flex-col gap-y-12 w-1/2">
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">Full Name</h5>
                      <p className="text-[#2f2f28]">{profile[0].Name}</p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">Address 1</h5>{" "}
                      <p className="text-[#2f2f28]">{profile[0].Address1}</p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">Address 2</h5>{" "}
                      <p className="text-[#2f2f28]">
                        {profile[0].Address2 === null
                          ? "N/A"
                          : profile[0].Address2}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-12 w-1/2">
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">City</h5>
                      <p className="text-[#2f2f28]">{profile[0].City}</p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">State</h5>{" "}
                      <p className="text-[#2f2f28]">{profile[0].State}</p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">Zipcode</h5>{" "}
                      <p className="text-[#2f2f28]">{profile[0].Zipcode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-y-12 font-inter px-16 py-24">
              <div className="text-start flex flex-row justify-between items-center">
                <h1 className="font-alegreya text-7xl font-bold">Profile</h1>
                <button onClick={handleCancel}>
                  <IoMdClose size={20} />
                </button>
              </div>

              <form
                className="flex flex-col gap-y-12 text-start"
                onSubmit={handleUpdate}
              >
                <div className="flex flex-row gap-x-4">
                  <div className="flex flex-col gap-y-12 w-1/2">
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">
                        Full Name <span className="text-red-400">*</span>
                      </h5>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="full name"
                        value={profileValues.fullName}
                        onChange={handleProfileChange}
                        className="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                      />
                      {errors.fullName ? (
                        <p className="text-red-400">{errors.fullName}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">
                        Address 1 <span className="text-red-400">*</span>
                      </h5>{" "}
                      <input
                        type="text"
                        name="address1"
                        placeholder="address line 1"
                        value={profileValues.address1}
                        onChange={handleProfileChange}
                        className="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                      />
                      {errors.address1 ? (
                        <p className="text-red-400">{errors.address1}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">Address 2</h5>{" "}
                      <input
                        type="text"
                        name="address2"
                        placeholder="address line 2"
                        value={profileValues.address2}
                        onChange={handleProfileChange}
                        className="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                      />
                      {errors.address2 ? (
                        <p className="text-red-400">{errors.address2}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-12 w-1/2">
                    <div className="flex flex-col gap-y-2">
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
                    <div className="flex flex-col gap-y-2">
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
                        <option value="" disabled hidden selected className="">
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
                    <div className="flex flex-col gap-y-2">
                      <h5 className="font-bold">
                        Zipcode <span className="text-red-400">*</span>
                      </h5>{" "}
                      <input
                        type="text"
                        name="zipcode"
                        placeholder="zipcode"
                        value={profileValues.zipcode}
                        onChange={handleProfileChange}
                        className="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                      />
                      {errors.zipcode ? (
                        <p className="text-red-400">{errors.zipcode}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="font-bold bg-[#0b3721] rounded-md p-4 text-[#fafafa] hover:bg-[#3d7b52] transition-colors ease-in-out duration-500"
                >
                  Update Profile
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
