import React, { useState } from "react";
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
        throw error;
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
      // queryClient.invalidateQueries({ queryKey: ["userdata"] });
      // queryClient.invalidateQueries({ queryKey: ["userData1"] });
      navigate("/");
      window.location.reload();
    },
    onError: (err) => toast.error(err.response.data.message),
  });
  console.log(userData?.data);

  const user = userData?.data;
  const count = userData?.data?.cartItems?.length || 0;
  console.log(count);

  const isAdmin = userData?.data?.role === "admin";

  return (
    <nav className="z-100 w-full h-[40px] bg-amber-400 sticky top-0 flex items-center justify-between">
      <Link to="/">
        <h4 className="ml-[20px] hover:bg-amber-500 cursor-pointer">SHOPPER</h4>
      </Link>
      <div className="flex w-[400px] items-center justify-around">
        <Link to="/">
          <span className="text-2xl hover:bg-amber-500 cursor-pointer">
            Home
          </span>
        </Link>
        {
          <Link to="/cart">
            <span className="relative text-2xl flex items-center  w-[90px] justify-around hover:bg-amber-500 cursor-pointer">
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
        {!user && !userDataLoading && (
          <Link to="/signup">
            <span className="text-2xl hover:bg-amber-500 cursor-pointer">
              Signup
            </span>
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin-secret-dashboard">
            <button
              onClick={() => navigate("/admin-secret-dashboard")}
              className={
                "flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 bg-emerald-600 text-white"
              }
            >
              <FaLock /> Dashboard
            </button>
          </Link>
        )}
        {user && (
          <Link to="#" onClick={() => setVisibleRight(true)}>
            <span className="text-2xl hover:bg-amber-500 cursor-pointer">
              <UserRound />
            </span>
          </Link>
        )}
        {!user && !userDataLoading && (
          <Link to="/login">
            <span className="text-2xl hover:bg-amber-500 cursor-pointer">
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
