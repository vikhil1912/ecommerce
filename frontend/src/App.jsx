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

const App = () => {
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      try {
        return await axiosInstance.get("/auth/user");
      } catch (error) {
        if (error.response && error.response.status == 401) {
          try {
            const refreshResponse = await axiosInstance.post(
              "/auth/refreshtoken"
            );
            if (refreshResponse.status == 200) {
              queryClient.invalidateQueries({ queryKey: ["userData"] });
            }
          } catch (err) {
            if (err.response && err.response.status == 401) return null;
            throw err;
          }
        }
        throw error;
      }
    },
  });
  const user = userData?.data;
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
            user && user.role === "admin" ? <AdminPage /> : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
