import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    setPasswordError("");
    setUsernameError("");

    let hasErrors = false;

    if (username.length === 0) {
      setUsernameError("* Please enter your username");
      hasErrors = true;
    }

    if (!/^[a-zA-Z][a-zA-Z0-9]{3,23}$/.test(username)) {
      setUsernameError("* Please enter a valid username");
      hasErrors = true;
    }

    if (password.length === 0) {
      setPasswordError("* Please enter a password");
      hasErrors = true;
    }
    if (password.length < 7) {
      setPasswordError("* The password must be 8 characters or longer");
      hasErrors = true;
    }
    return hasErrors;
  };

  const signup = async (e) => {
    e.preventDefault();

    const hasErrors = validate();

    if (!hasErrors) {
      console.log("No errors detected");
      const userData = {
        username: username,
        password: password,
      };

      console.log("userData", userData);

      try {
        const response = await fetch("http://localhost:3001/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        });

        console.log(response);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(data.error);
          } else {
            throw new Error("There was a network error!");
          }
        }

        alert("Successfully signed up!");
        setPasswordError("");
        setUsernameError("");
        navigate("/")
      } catch (error) {
        alert(error);
        console.log("There was an error fetching:", error);

      }
    } else {
      console.log("usernameErrors", usernameError);
      console.log("passwordError", passwordError);
      console.log("Input is not valid");
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-[#fafafa] text-[#2f2f28] relative font-inter">
      <div className="flex flex-row h-screen w-1/2 bg-white border-l border-[#e2e2e0] inset-y-0 right-0 absolute items-center">
        <div className="flex flex-col px-16 gap-y-20 w-full">
          <div className="flex flex-col text-start gap-y-6">
            <h1 className="font-alegreya text-7xl font-bold">Sign Up</h1>
            <p className="text-xl">
              To get started, first we'll need a username and password.
            </p>
          </div>

          <div className="flex flex-col gap-y-16">
          <form className="flex flex-col gap-y-12" onSubmit={signup}>
              <div className="flex flex-col gap-y-6 text-start">
                <label className="flex flex-row items-center relative w-full focus-within:text-[#2f2f28] text-[#e2e2e0]">
                  <FaUser className="absolute ml-2 w-10 pointer-events-none " />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    class="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 pl-12 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                  />
                </label>
                {usernameError ? (
                  <p className="text-red-400">{usernameError}</p>
                ) : null}
                <label class="flex flex-row items-center relative w-full focus-within:text-[#2f2f28] text-[#e2e2e0]">
                  <FaLock className="absolute ml-2 w-10 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    class="text-[#2f2f28] border bg-[#fafafa] border-[#e2e2e0] p-4 pl-12 w-full rounded-md focus:outline-none focus:border-[#0b3721] focus:border-2"
                  />
                </label>
                {passwordError ? (
                  <p className="text-red-400">{passwordError}</p>
                ) : null}
              </div>

              <button
                type="submit"
                className="font-bold bg-[#0b3721] rounded-md p-4 text-[#fafafa] hover:bg-[#3d7b52] transition-colors ease-in-out duration-500"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
