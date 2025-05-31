import React from "react";
import { FaPlus } from "react-icons/fa";
import AddressCard from "../components/AddressCard";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const AddressPage = () => {
  const navigate = useNavigate();
  const { data: allAddresses } = useQuery({
    queryKey: ["allAddresses1"],
    queryFn: async () => {
      return axiosInstance.get("/address/");
    },
  });
  const addresses = allAddresses?.data;
  console.log(addresses);

  return (
    <div className="bg-white w-full h-screen py-10 px-20 md:px-40 xl:px-60">
      <h1 className="text-black text-4xl">Your addresses</h1>
      <div className="w-full mt-10 grid grid-cols-1 gap-y-8  lg:grid-cols-2 2xl:grid-cols-3">
        <div
          onClick={() => navigate(`/address-add-form`)}
          className="w-80 h-64 bg-white flex flex-col items-center justify-center border-[2px] border-gray-400 border-dashed rounded-2xl hover:cursor-pointer hover:bg-gray-100"
        >
          <FaPlus className="text-gray-400 text-8xl" />
          <span className="text-gray-400 text-3xl font-bold">Add address</span>
        </div>
        {addresses?.length > 0 &&
          addresses.map((address) => <AddressCard address={address} />)}
      </div>
    </div>
  );
};

export default AddressPage;
