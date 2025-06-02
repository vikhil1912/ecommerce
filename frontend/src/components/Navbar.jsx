import React, { useEffect, useState } from "react";
import { FaOpencart } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { Sidebar } from "primereact/sidebar";
import { UserRound } from "lucide-react";

const Navbar = () => {
  const [visibleRight, setVisibleRight] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ["userData1"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/auth/user");
        return response;
      } catch (error) {
        if (error.response && error.response.status == 401) {
          try {
            const refreshResponse = await axiosInstance.post(
              "/auth/refreshtoken"
            );
            if (refreshResponse?.status === 200) {
              localStorage.setItem("user", true);
              localStorage.setItem("role", refreshResponse?.data.role);
            }
            queryClient.invalidateQueries({ queryKey: ["userData1"] });
          } catch (err) {
            if (err.response && err.response.status == 401) return null;
            throw err;
          }
        }
        return null;
      }
    },
  });
  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/logout");
      if (response?.status === 200) {
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      navigate("/");
      window.location.reload();
    },
    onError: (err) => toast.error(err.response.data.message),
  });
  console.log(userData?.data);

  const user = userData?.data;
  const count = userData?.data?.cartItems?.length || 0;
  const isUserLoggedIn = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  return (
    <nav className="z-100 w-full h-[50px] bg-gray-700 sticky top-0 flex items-center justify-between">
      <p className="hidden">{user?.name}</p>
      <Link to="/">
        <h4 className="ml-[20px] transition-colors text-2xl duration-200 text-black hover:bg-white hover:text-black py-2 px-4 rounded-2xl cursor-pointer">
          SHOPPER
        </h4>
      </Link>
      <div className="flex w-[400px] items-center justify-around ">
        <Link to="/">
          <span className="text-2xl transition-colors duration-200  cursor-pointer hover:bg-white  py-1 px-1 rounded-2xl">
            Home
          </span>
        </Link>
        {
          <Link to="/cart">
            <span className="relative text-2xl flex items-center  w-[120px] justify-around  transition-colors duration-200  hover:cursor-pointer hover:bg-white  py-1 px-4 rounded-2xl">
              <FaOpencart className="" /> Cart{" "}
              <span
                className="absolute -top-1 left-4 bg-emerald-500 text-white rounded-full px-2 py-0.5 
				text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
              >
                {count}
              </span>
            </span>
          </Link>
        }
        {!isUserLoggedIn && (
          <Link to="/signup">
            <span className="text-2xl transition-colors duration-200  hover:cursor-pointer hover:bg-white  py-1 px-4 rounded-2xl">
              Signup
            </span>
          </Link>
        )}
        {isUserLoggedIn && role === "admin" && (
          <Link to="/admin-secret-dashboard">
            <button
              onClick={() => navigate("/admin-secret-dashboard")}
              className={
                "flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 bg-emerald-600 text-white hover:cursor-pointer hover:bg-emerald-700"
              }
            >
              <FaLock /> Dashboard
            </button>
          </Link>
        )}
        {isUserLoggedIn && (
          <Link to="#" onClick={() => setVisibleRight(true)}>
            <div className="text-2xl transition-colors duration-200  cursor-pointer hover:bg-white  py-1 px-1 rounded-full">
              <UserRound />
            </div>
          </Link>
        )}
        {!isUserLoggedIn && (
          <Link to="/login">
            <span className="text-2xl transition-colors duration-200  cursor-pointer hover:bg-white  py-1 px-4 rounded-2xl">
              Login
            </span>
          </Link>
        )}
      </div>
      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
        className="bg-gray-700 z-101 pt-10 px-4"
      >
        <p
          className="h-10 mt-10 w-full text-white  bg-gray-500 flex items-center justify-center rounded-2xl hover:bg-gray-400 cursor-pointer "
          onClick={() => {
            setVisibleRight(false);
            navigate("/");
          }}
        >
          Home
        </p>
        <p
          className="h-10 mt-5 w-full text-white  bg-gray-500 flex items-center justify-center rounded-2xl hover:bg-gray-400 cursor-pointer "
          onClick={() => {
            setVisibleRight(false);
            navigate("/orders");
          }}
        >
          My Orders
        </p>
        <p
          className="h-10 mt-5 w-full text-white  bg-gray-500 flex items-center justify-center rounded-2xl hover:bg-gray-400 cursor-pointer "
          onClick={() => {
            setVisibleRight(false);
            navigate("/address");
          }}
        >
          Address
        </p>
        <p
          className="h-10 mt-5 w-full text-white  bg-gray-500 flex items-center justify-center rounded-2xl hover:bg-gray-400 cursor-pointer "
          onClick={() => {
            setVisibleRight(false);
            logoutMutate();
          }}
        >
          Logout <IoLogOutOutline className="ml-4" />
        </p>
      </Sidebar>
    </nav>
  );
};

export default Navbar;
