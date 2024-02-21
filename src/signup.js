import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as SignupImg } from "./assets/Enter-Password-2--Streamline-Brooklyn.svg";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    username: "",
    password: "",
  });

  const [signupErrors, setSignupErrors] = useState({});

  const navigate = useNavigate();

  const handleSignupChange = (e) => {
    setSignupInfo((prevState) => ({
      ...signupInfo,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    setSignupErrors({});
    let errors = {};

    var hasErrors = false;

    if (signupInfo.username.length === 0) {
      errors.username = "* Please enter your username";
      hasErrors = true;
    }

    if (!/^[a-zA-Z][a-zA-Z0-9]{3,23}$/.test(signupInfo.username)) {
      errors.username = "* Please enter a valid username";
      hasErrors = true;
    }

    if (signupInfo.password.length === 0) {
      errors.password = "* Please enter a password";
      hasErrors = true;
    }
    if (signupInfo.password.length < 7) {
      errors.password = "* The password must be 8 characters or longer";
      hasErrors = true;
    }

    setSignupErrors(errors);
    return hasErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors = validate();

    if (!hasErrors) {
      navigate("/profile", { state: signupInfo });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen text-[#153640] selection:bg-[#88BBC8]">
      <div className="flex flex-col xl:flex-row space-y-2 xl:space-x-20 xl:space-y-0 m-12 xl:m-20">
        <SignupImg className="h-fit w-full xl:h-full xl:basis-1/2" />

        <div className="xl:basis-1/2 space-y-8 xl:p-16 xl:rounded-md xl:border-2 xl:border-[#153640] xl:shadow-[10px_10px_0px_0px_rgba(21,54,64)]">
          <div className="space-y-4">
            <h1 className="font-montserrat text-4xl font-bold xl:text-5xl">
              sign up
            </h1>
            <h3 className="xl:text-xl">
              first we'll need to create a username and password.
            </h3>
          </div>

          <form className="space-y-16 w-full">
            <div className="space-y-6">
              <div className="flex flex-col gap-y-2 ">
                <input
                  type="username"
                  placeholder="username"
                  name="username"
                  value={signupInfo.username}
                  onChange={handleSignupChange}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                ></input>
                {signupErrors.username ? (
                  <p className="text-red-400">{signupErrors.username}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-y-2">
                <input
                  type="password"
                  placeholder="password"
                  name="password"
                  value={signupInfo.password}
                  onChange={handleSignupChange}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                ></input>
                {signupErrors.password ? (
                  <p className="text-red-400">{signupErrors.password}</p>
                ) : null}
              </div>
            </div>

            <button
              className="flex flex-row gap-x-2 justify-center items-center bg-[#153640] text-[#FBFAF5] p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
              type="submit"
              onClick={handleSubmit}
            >
              next
              <FaLongArrowAltRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

//   return (
//     // bg-gradient-to-bl from-[#749FFC] to-white
//     <div className="flex justify-center items-center h-screen text-[#153640] selection:bg-[#88BBC8] gap-x-20">
//       <div className="w-2/5">
//         <SignupImg className="w-full h-full" />
//       </div>
//       <div className="w-1/3 flex flex-col justify-center items-center gap-y-12 p-16 rounded-md border-2 border-[#153640] shadow-[10px_10px_0px_0px_rgba(21,54,64)]">
//         <div className="space-y-4 w-full">
//           <h1 className="font-montserrat text-5xl font-bold">sign up</h1>
//           <h3 className="text-xl">
//             first we'll need to create a username and password.
//           </h3>
//         </div>
//         <form className="space-y-16 w-full">
//           <div className="space-y-10">
//             <div className="flex flex-col gap-y-2 ">
//               <input
//                 type="username"
//                 placeholder="username"
//                 name="username"
//                 value={signupInfo.username}
//                 onChange={handleSignupChange}
//                 className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
//               ></input>
//               {signupErrors.username ? (
//                 <p className="text-red-400">{signupErrors.username}</p>
//               ) : null}
//             </div>
//             <div className="flex flex-col gap-y-2">
//               <input
//                 type="password"
//                 placeholder="password"
//                 name="password"
//                 value={signupInfo.password}
//                 onChange={handleSignupChange}
//                 className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
//               ></input>
//               {signupErrors.password ? (
//                 <p className="text-red-400">{signupErrors.password}</p>
//               ) : null}
//             </div>
//           </div>

//           <button
//             className="flex flex-row gap-x-2 justify-center items-center bg-[#153640] text-[#FBFAF5] p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
//             type="submit"
//             onClick={handleSubmit}
//           >
//             next
//             <FaLongArrowAltRight />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
