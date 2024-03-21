import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as CarGas } from "./assets/Car-Getting-Gas--Streamline-Milano.svg";
//import { response } from "express";


async function loginUser(credentials, serverDomain) {
  try {
    const response = await fetch(serverDomain, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to login:', errorData.error)
      if (errorData.error === "Invalid credentials") {
        // TODO Handle this.
        alert("Invalid Credentials.");
      }
      else {
        // TODO Handle this.
        alert("Error. Check your network connection.")
      }
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    // alert(JSON.stringify(data));

    return data;
  }
  catch (error) {
    console.error("There was an error fetching the resource.", error);
    throw error;
  }
}

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validate = (e) => {
    e.preventDefault();
    setPasswordError("");
    setUsernameError("");


    if (username.length === 0) {
      setUsernameError("* Please enter your username.");
    }

    if (!/^[a-zA-Z][a-zA-Z0-9]{3,23}$/.test(username)) {
      setUsernameError("* Please enter a valid username.");
    }

    if (password.length === 0) {
      setPasswordError("* Please enter a password");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setPasswordError("");
    setUsernameError("");

    if (username.length === 0) {
      setUsernameError("* Please enter your username.");
    }

    if (!/^[a-zA-Z][a-zA-Z0-9]{3,23}$/.test(username)) {
      setUsernameError("* Please enter a valid username.");
    }

    if (password.length === 0) {
      setPasswordError("* Please enter a password");
    }

    if (!(usernameError === "" && passwordError === "")) {
      return;
    }
    // alert("You just submitted a form!");
    try {
      const token = await loginUser({
        username,
        password
      }, 'http://localhost:3001/api/user');
      // alert(token);
      navigate("/fuel");
    }
    catch(error) {
      //TODO Something?
    }
  }

  return (
    <div className="flex justify-center items-center h-screen text-[#153640] selection:bg-[#88BBC8]">
      <div className="flex flex-col xl:flex-row space-y-2 xl:space-x-20 xl:space-y-0 m-12 xl:m-20">
        <CarGas className="h-fit w-full xl:h-full xl:basis-1/2" />

        <div className="xl:basis-1/2 space-y-8 xl:p-16 xl:rounded-md xl:border-2 xl:border-[#153640] xl:shadow-[10px_10px_0px_0px_rgba(21,54,64)]">
          <div className="space-y-4">
            <h1 className="font-montserrat text-4xl font-bold xl:text-5xl">
              welcome back!
            </h1>
            <h3 className="xl:text-xl">
              nice to see you again! please enter your login info to get
              started.
            </h3>
          </div>

          <form className="space-y-16 w-full" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="flex flex-col gap-y-2 ">
                <input
                  type="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                ></input>
                {usernameError ? (
                  <p className="text-red-400">{usernameError}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-y-2">
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 px-4 bg-transparent border-b-2 border-[#153640] focus:outline-[#88BBC8]"
                ></input>
                {passwordError ? (
                  <p className="text-red-400">{passwordError}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-8">
              <button
                className="bg-[#153640] text-[#FBFAF5] p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]"
                type="submit"
                onClick={handleSubmit}
              >
                log in
              </button>
              <p>
                Not a member?{" "}
                <Link
                  to="/signup"
                  className="text-[#153640] font-black hover:text-[#78a7b4] transition-all ease-in-out duration-500"
                >
                  Sign Up
                </Link>
              </p>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// async function loginUser(credentials, serverDomain) {
//   try {
//     const response = await fetch(serverDomain, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(credentials)
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error("Network error");
//       }
//       return response.json();
//     })
//     .then(data => {
//       alert(data);
//     })
//     .catch(error => {
//       console.error("There was an error");
//     })
// }
