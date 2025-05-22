import React from "react";
import { FaOpencart } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const Navbar = () => {
  const queryClient = useQueryClient();
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
  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: async () => {
      return axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      toast.success("Logged out successfully");
    },
    onError: (err) => toast.error(err.response.data.message),
  });
  console.log(userData?.data);

  const user = userData?.data;
  const isAdmin = userData?.data?.role === "admin";
  const count = userData?.data?.cartItems?.length || 0;

  return (
    <nav className="w-full h-[40px] bg-amber-400 sticky top-0 flex items-center justify-between">
      <Link to="/">
        <h4 className="ml-[20px] hover:bg-amber-500 cursor-pointer">SHOPPER</h4>
      </Link>
      <div className="flex w-[400px] items-center justify-around">
        <Link to="/">
          <span className="text-2xl hover:bg-amber-500 cursor-pointer">
            Home
          </span>
        </Link>
        {user && (
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
        )}
        {!user && (
          <Link to="/signup">
            <span className="text-2xl hover:bg-amber-500 cursor-pointer">
              Signup
            </span>
          </Link>
        )}
        {isAdmin && (
          <Link to="#">
            <span className="flex items-center text-2xl bg-red-700 hover:bg-red-400 cursor-pointer">
              <FaLock /> Dashboard
            </span>
          </Link>
        )}
        {user && (
          <Link to="#" onClick={logoutMutate}>
            <span className="text-2xl hover:bg-amber-500 cursor-pointer">
              <IoLogOutOutline />
            </span>
          </Link>
        )}
        {!user && (
          <Link to="/login">
            <span className="text-2xl hover:bg-amber-500 cursor-pointer">
              Login
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
