//import logo from './logo.svg';
import "./App.css";
//import Navbar from './components/navbar.js';
import Login from "./login.js";
import Signup from "./signup.js";
import ProfileForm from "./profile.js";
import Homepage from "./homepage.js";
import Navbar from "./navbar.js";
import Quote from "./fuelQuoteForm.js";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="bg-[#FBFAF5]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/profile" element={<ProfileForm />}></Route>
          <Route path="/homepage" element={<Homepage />}></Route>
          <Route path="/navbar" element={<Navbar />}></Route>
          <Route path="/fuelQuoteForm" element={<Quote />}></Route>
          <Route path="/fuel" element={<FuelQuoteHistory />}></Route>
        </Routes>
      </BrowserRouter>
    </div>

    // <div className="">
    //    <Login />
    // </div>
  );
}

export default App;
