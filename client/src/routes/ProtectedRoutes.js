import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  // Function to get a cookie value by name
  const getCookie = (name) => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));

    return cookies ? cookies.split("=")[1] : null;
  };

  // Example: Get the value of the 'username' cookie
  const cookie = getCookie("connect.sid");
  console.log("cookie", cookie);

  if (cookie !== null) {
    return <Navigate to="/profile" />;
  }
  return children;
};

export default ProtectedRoutes;
