import logo from "./logo.svg";
import "./App.css";
import Login from "./login.js";
import Signup from "./signup.js";

import Navbar from "./navbar.js";
import Profile from "./profile.js";
import FuelQuoteForm from "./fuelQuoteForm.js";
import FuelQuoteHistory from "./fuelQuoteHistory.js";


import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/navbar" element={<Navbar />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/form" element={<FuelQuoteForm />}></Route>
          <Route path="/history" element={<FuelQuoteHistory />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
