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

const App = () => {
  const queryClient = useQueryClient();
  const { data: userdata, isLoading: userDataLoading } = useQuery({
    queryKey: ["userdata"],
    queryFn: async () => {
      try {
        return axiosInstance.get("/auth/user");
      } catch (err) {
        if (err?.response?.data == 401) {
          try {
            await axiosInstance.post("/auth/refreshtoken");
          } catch (error) {
            if (error?.response?.data == 401) {
              queryClient.invalidateQueries({ queryKey: ["userdata"] });
              return null;
            }
            throw new Error();
          }
        }
      }
    },
  });
  const user = userdata?.data;
  console.log(userdata);

  return (
    <div className="bg-gray-900 min-h-screen">
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/admin-secret-dashboard"
          element={
            userDataLoading ? (
              <>
                <h1 className="text-3xl text-white">Loading...</h1>
              </>
            ) : user && user.role === "admin" ? (
              <AdminPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/purchase-success/:sessionId"
          element={<PurchaseSuccessPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
