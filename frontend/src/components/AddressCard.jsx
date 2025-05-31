import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

const AddressCard = ({ address }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: deleteAddress } = useMutation({
    mutationFn: async () => {
      const flag = window.confirm("Do you want to delete this address");
      if (flag) await axiosInstance.delete(`/address/${address._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAddresses1"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
  return (
    <div className="w-80 min-h-64 py-3 pl-4 pr-[3px] bg-white flex flex-col justify-between  border-[1px] border-gray-400 rounded-2xl">
      <div className="w-full">
        <h1 className="text-sm font-bold text-black">{address.name}</h1>
        <p className="leading-tight font-normal">{address.description}</p>
        <p className="font-normal">
          {address.city}, {address.state} {address.pincode}
        </p>
        <p className="font-normal">{address.country}</p>
        <p className="font-normal">Phone number:{address.phonenumber}</p>
      </div>
      <div>
        <p className="font-normal">
          <span
            onClick={() => navigate(`/address-edit-form/${address._id}`)}
            className="font-normal hover:underline cursor-pointer text-blue-600"
          >
            Edit
          </span>{" "}
          |{" "}
          <span
            onClick={() => deleteAddress()}
            className="font-normal hover:underline cursor-pointer text-blue-600"
          >
            Delete
          </span>
        </p>
      </div>
    </div>
  );
};

export default AddressCard;
