import React from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { Toaster } from "react-hot-toast";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import CategoryPage from "./pages/CategoryPage.jsx";
import { axiosInstance } from "./lib/axios.js";
import CartPage from "./pages/CartPage.jsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.jsx";
import Orders from "./pages/Orders.jsx";
import AddressPage from "./pages/AddressPage.jsx";
import AddAddressForm from "./components/AddAddressForm.jsx";
import UpdateAddress from "./components/UpdateAddress.jsx";
import ProtectRoute from "./auth/ProtectRoute.jsx";

const App = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <ProtectRoute
              isAuthRoute={true}
              isAdminRoute={false}
              children={<Login />}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectRoute
              isAuthRoute={true}
              isAdminRoute={false}
              children={<Signup />}
            />
          }
        />
        <Route
          path="/admin-secret-dashboard"
          element={
            <ProtectRoute
              isAuthRoute={false}
              isAdminRoute={true}
              children={<AdminPage />}
            />
          }
        />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/purchase-success/:sessionId"
          element={<PurchaseSuccessPage />}
        />
        <Route
          path="/orders"
          element={
            <ProtectRoute
              isAuthRoute={false}
              isAdminRoute={false}
              children={<Orders />}
            />
          }
        />
        <Route
          path="/address"
          element={
            <ProtectRoute
              isAuthRoute={false}
              isAdminRoute={false}
              children={<AddressPage />}
            />
          }
        />
        <Route
          path="/address-add-form"
          element={
            <ProtectRoute
              isAuthRoute={false}
              isAdminRoute={false}
              children={<AddAddressForm />}
            />
          }
        />
        <Route
          path="/address-edit-form/:id"
          element={
            <ProtectRoute
              isAuthRoute={false}
              isAdminRoute={false}
              children={<UpdateAddress />}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
