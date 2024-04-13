import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as CarGas } from "./assets/Car-Getting-Gas--Streamline-Milano.svg";
import Modal from "./modal.js"
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
        throw new Error("Invalid credentials");
      }
    }
    const data = await response.json();
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
  const [openModal, setOpenModal] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // const [isAuthenticated, setIsAuthenticated] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/check-auth", { credentials: "include" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        else {
          // alert("ERROR!")
          // alert(JSON.stringify(response));
          throw new Error("Network response failure");
        }
      })
      .then((data) => {
        if (data.loggedIn === true) {
          // alert("You're authed!");
          navigate("fuel");
        }
        else {
          // alert("Not authed");
          // alert(JSON.stringify(data))
        }
      })
      .catch((error) => {
        console.error("Error fetching login data: ", error);
      });
  }, []);

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
      }, '/api/login');
      // alert("TOKEN: " + JSON.stringify(token));
      navigate("/fuel");
    }
    catch(error) {
      //TODO Something?
      setOpenModal(true);
      console.log("Error" + error);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen text-[#153640] selection:bg-[#88BBC8]">
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <p className="font-montserrat">Invalid login.</p>
      </Modal>
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
              {/* <button */}
              {/*   className="bg-[#153640] text-[#FBFAF5] p-2 rounded-md w-full font-bold transition-all ease-in-out duration-500 hover:bg-[#88BBC8] hover:text-[#153640]" */}
              {/*   onClick={() => setOpenModal(true)} */}
              {/* > */}
              {/*   modal test */}
              {/* </button> */}
        </div>
      </div>
    </div>
  );
}

