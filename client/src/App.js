import "./App.css";

import Home from "./Home.js";

import Login from "./login.js";
import Signup from "./signup.js";

import Profile from "./profile.js";
import FuelQuoteForm from "./fuelQuoteForm.js";
import FuelQuoteHistory from "./fuelQuoteHistory.js";

import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";

import NotFound from "./NotFound.js";

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Login />
              </ProtectedRoutes>
            }
          ></Route>

          <Route
            path="/signup"
            element={
              <ProtectedRoutes>
                <Signup />
              </ProtectedRoutes>
            }
          ></Route>

          <Route
            path="/profile"
            element={
              <AuthenticatedRoutes>
                <Profile />
              </AuthenticatedRoutes>
            }
          ></Route>

          <Route
            path="/form"
            element={
              <AuthenticatedRoutes>
                <FuelQuoteForm />
              </AuthenticatedRoutes>
            }
          ></Route>

          <Route
            path="/history"
            element={
              <AuthenticatedRoutes>
                <FuelQuoteHistory />
              </AuthenticatedRoutes>
            }
          ></Route> */}

          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/form" element={<FuelQuoteForm />}></Route>
          <Route path="/history" element={<FuelQuoteHistory />}></Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
