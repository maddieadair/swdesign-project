import React, { useState } from "react";
// import { ReactComponent as ProfileSignUp } from "./assets/Enter-Password-4--Streamline-Brooklyn.svg";
// import { FaCreativeCommonsPdAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa6";

async function modifyProfile(values, serverDomain) {
  try {
    const response = await fetch(serverDomain + "/api/profile", {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });
    if (!response.ok) {
      throw new Error("I messed up." + response.status);
    }
    return true;
  }
  catch (error) {
    console.error("I messed up.");
    throw error;
  }
}

export default function ProfileForm() {
  const [profileValues, setProfileValues] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const handleProfileChange = (e) => {
    setProfileValues((prevState) => ({
      ...profileValues,
      [e.target.name]: e.target.value,
    }));
  };

  //const [buttonMessage, setButtonMessage] = useState("Submit");

  const validate = () => {
    setErrors({});
    let errors = {};
    var hasErrors = false;

    if (profileValues.fullName.length === 0) {
      errors.fullName = "Please enter a valid name.";
      hasErrors = true;
    } else if (profileValues.fullName.length > 50) {
      errors.fullName = "Name cannot exceed 50 characters.";
      hasErrors = true;
    }

    if (profileValues.address1.length === 0) {
      errors.address1 = "* Please enter a valid address.";
      hasErrors = true;
    } else if (profileValues.address1 > 100) {
      errors.address1 = "* Address cannot exceed 100 characters.";
      hasErrors = true;
    }

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
        errors.zipcode = "* Please enter a valid zipcode of at least 5 characters.";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasErrors = validate();

    if (!hasErrors) {
      try {
        const success = await modifyProfile({
          name: profileValues.fullName,
          address: {
            "state": profileValues.state,
            "city" : profileValues.city,
            "zipcode" : profileValues.zipcode,
            "address1" : profileValues.address1,
            "address2" : profileValues.address2
          }
        }, "http://localhost:3001")
      if (success) {
        navigate("/homepage", {
          state: { loginInfo: data, profile: profileValues },
        });
      }
    }
      catch(error) {alert("Error after sent modify profile: " + error);}
    };
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const hasErrors = validate();

  //   if (!hasErrors) {
  //     // navigate("/profile", { state: signupInfo });
  //     try {
  //       const success = await signupUser({username: signupInfo.username, password: signupInfo.password}, "localhost:3001")
  //       if (success) {
  //         navigate("/profile", { state: signupInfo })
  //       }
  //     }
  //     catch (error) {
  //       alert(error);
  //     }
  // };

  return (
    <div className="flex justify-center items-center h-screen text-[#153640] selection:bg-[#88BBC8] overflow-auto">
      <div className="xl:basis-1/2 space-y-8 xl:p-16 xl:rounded-md xl:border-2 xl:border-[#153640] xl:shadow-[10px_10px_0px_0px_rgba(21,54,64)]">
        <div className="space-y-4">
          <h1 className="font-montserrat text-4xl font-bold xl:text-5xl">
            profile details
          </h1>
          <h3 className="xl:text-xl">
            just a few more details to wrap things up.
          </h3>
        </div>

        <form className="space-y-16 w-full max-w-xs xl:max-w-2xl">
          <div className="flex xl:flex-row xl:gap-x-12 flex-col gap-y-6 xl:gap-y-0">
            <div className="space-y-6 xl:w-full">
              <div className="flex flex-col gap-y-2 ">
                <input
                  type="text"
                  name="fullName"
                  placeholder="full name"
                  value={profileValues.fullName}
                  onChange={handleProfileChange}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                ></input>
                {errors.fullName && (
                  <p className="text-red-400">{errors.fullName}</p>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <input
                  type="text"
                  name="address1"
                  placeholder="address line 1"
                  value={profileValues.address1}
                  onChange={handleProfileChange}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                ></input>
                {errors.address1 ? (
                  <p className="text-red-400">{errors.address1}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-y-2 ">
                <input
                  type="text"
                  name="address2"
                  placeholder="address line 2 (optional)"
                  value={profileValues.address2}
                  onChange={handleProfileChange}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                ></input>
                {errors.address2 ? (
                  <p className="text-red-400">{errors.address2}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-6 xl:w-full">
              <div className="flex flex-col gap-y-2">
                <input
                  type="text"
                  name="city"
                  placeholder="city"
                  value={profileValues.city}
                  onChange={handleProfileChange}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                ></input>
                {errors.city ? (
                  <p className="text-red-400">{errors.city}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-y-2">
                <select
                  value={profileValues.state}
                  name="state"
                  onChange={handleProfileChange}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                >
                  {/* <option value="" selected disabled hidden className="">state</option> */}
                  <option value="" disabled hidden className="">
                    state
                  </option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District Of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
                {errors.state ? (
                  <p className="text-red-400">{errors.state}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-y-2 ">
                <input
                  type="text"
                  name="zipcode"
                  placeholder="zipcode"
                  value={profileValues.zipcode}
                  onChange={handleProfileChange}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                ></input>
                {errors.zipcode ? (
                  <p className="text-red-400 text-wrap">{errors.zipcode}</p>
                ) : null}
              </div>
            </div>
          </div>

          <button
            className="bg-[#153640] text-[#FBFAF5] flex flex-row justify-center items-center gap-x-2 p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
            type="submit"
            onClick={handleSubmit}
          >
            create profile
            <FaUserCheck />
          </button>
        </form>
      </div>
    </div>
  );
}

//   return (
//     <div className="flex justify-center items-center h-screen text-[#153640] selection:bg-[#88BBC8] gap-x-32">
//       <div className="w-2/5">
//         <ProfileSignUp className="w-full h-full" />
//       </div>
//       <div className="w-1/3 flex flex-col justify-center items-center gap-y-12 p-16 rounded-md border-2 border-[#153640] shadow-[10px_10px_0px_0px_rgba(21,54,64)]">
//         <div className="space-y-4 w-full">
//           <h1 className="font-montserrat text-5xl font-bold">profile info</h1>
//           <h3 className="text-xl">
//             just a few more details to wrap things up.
//           </h3>
//         </div>
//         <form className="space-y-16 w-full">
//           <div className="space-y-10">
//             <div className="flex flex-col gap-y-2 ">
//               <input
//                 type="text"
//                 name="fullName"
//                 placeholder="full name"
//                 value={profileValues.fullName}
//                 onChange={handleProfileChange}
//                 className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
//               ></input>
//               {errors.fullName && (
//                 <p className="text-red-400">{errors.fullName}</p>
//               )}
//             </div>
//             <div className="flex flex-col gap-y-2">
//               <input
//                 type="text"
//                 name="address1"
//                 placeholder="address line 1"
//                 value={profileValues.address1}
//                 onChange={handleProfileChange}
//                 className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
//               ></input>
//               {errors.address1 ? (
//                 <p className="text-red-400">{errors.address1}</p>
//               ) : null}
//             </div>
//             <div className="flex flex-col gap-y-2">
//               <input
//                 type="text"
//                 name="address2"
//                 placeholder="address line 2 (optional)"
//                 value={profileValues.address2}
//                 onChange={handleProfileChange}
//                 className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
//               ></input>
//               {errors.address2 ? (
//                 <p className="text-red-400">{errors.address2}</p>
//               ) : null}
//             </div>
//             <div className="flex flex-col gap-y-2">
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="city"
//                 value={profileValues.city}
//                 onChange={handleProfileChange}
//                 className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
//               ></input>
//               {errors.city ? (
//                 <p className="text-red-400">{errors.city}</p>
//               ) : null}
//             </div>

//             <div className="flex flex-col gap-y-2">
//               <select
//                 value={profileValues.state}
//                 name="state"
//                 onChange={handleProfileChange}
//                 className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
//               >
//                 {/* <option value="" selected disabled hidden className="">state</option> */}
//                 <option value="" disabled hidden className="">
//                   state
//                 </option>
//                 <option value="AL">Alabama</option>
//                 <option value="AK">Alaska</option>
//                 <option value="AZ">Arizona</option>
//                 <option value="AR">Arkansas</option>
//                 <option value="CA">California</option>
//                 <option value="CO">Colorado</option>
//                 <option value="CT">Connecticut</option>
//                 <option value="DE">Delaware</option>
//                 <option value="DC">District Of Columbia</option>
//                 <option value="FL">Florida</option>
//                 <option value="GA">Georgia</option>
//                 <option value="HI">Hawaii</option>
//                 <option value="ID">Idaho</option>
//                 <option value="IL">Illinois</option>
//                 <option value="IN">Indiana</option>
//                 <option value="IA">Iowa</option>
//                 <option value="KS">Kansas</option>
//                 <option value="KY">Kentucky</option>
//                 <option value="LA">Louisiana</option>
//                 <option value="ME">Maine</option>
//                 <option value="MD">Maryland</option>
//                 <option value="MA">Massachusetts</option>
//                 <option value="MI">Michigan</option>
//                 <option value="MN">Minnesota</option>
//                 <option value="MS">Mississippi</option>
//                 <option value="MO">Missouri</option>
//                 <option value="MT">Montana</option>
//                 <option value="NE">Nebraska</option>
//                 <option value="NV">Nevada</option>
//                 <option value="NH">New Hampshire</option>
//                 <option value="NJ">New Jersey</option>
//                 <option value="NM">New Mexico</option>
//                 <option value="NY">New York</option>
//                 <option value="NC">North Carolina</option>
//                 <option value="ND">North Dakota</option>
//                 <option value="OH">Ohio</option>
//                 <option value="OK">Oklahoma</option>
//                 <option value="OR">Oregon</option>
//                 <option value="PA">Pennsylvania</option>
//                 <option value="RI">Rhode Island</option>
//                 <option value="SC">South Carolina</option>
//                 <option value="SD">South Dakota</option>
//                 <option value="TN">Tennessee</option>
//                 <option value="TX">Texas</option>
//                 <option value="UT">Utah</option>
//                 <option value="VT">Vermont</option>
//                 <option value="VA">Virginia</option>
//                 <option value="WA">Washington</option>
//                 <option value="WV">West Virginia</option>
//                 <option value="WI">Wisconsin</option>
//                 <option value="WY">Wyoming</option>
//               </select>
//               {errors.state ? (
//                 <p className="text-red-400">{errors.state}</p>
//               ) : null}
//             </div>

//             <div className="flex flex-col gap-y-2">
//               <input
//                 type="text"
//                 name="zipcode"
//                 placeholder="zipcode"
//                 value={profileValues.zipcode}
//                 onChange={handleProfileChange}
//                 className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
//               ></input>
//               {errors.zipcode ? (
//                 <p className="text-red-400">{errors.zipcode}</p>
//               ) : null}
//             </div>
//           </div>

//           <div className="space-y-8">
//             <button
//               className="bg-[#153640] text-[#FBFAF5] p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
//               type="submit"
//               onClick={handleSubmit}
//             >
//               create profile
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
