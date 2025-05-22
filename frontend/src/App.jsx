import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
