import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loading.css";

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <span className="loader"></span>
    </div>
  );
}
