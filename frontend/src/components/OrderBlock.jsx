import React, { useState } from "react";
import OrderProductItem from "./OrderProductItem";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";

const OrderBlock = ({ order }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 max-w-4xl mt-3 mx-auto mb-7">
      <div className="flex justify-between text-sm text-gray-500">
        <div>
          <p className="font-medium">ORDER AT</p>
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-medium">TOTAL</p>
          <p>₹{order.totalAmount}</p>
        </div>
        <div>
          <p className="font-medium">SHIP TO</p>
          <div className="group relative">
            <p className="text-blue-600 cursor-pointer hover:underline">
              {order.address.name} ▾
            </p>
            <div
              className={`hidden group-hover:block absolute top-10 right-0transition-all duration-300 ease-in-out ${
                true
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <OrderAdressBlock address={order.address} />
            </div>
          </div>
        </div>
        <div className="text-right relative">
          <p className="text-xs">ORDER # {order._id}</p>
        </div>
      </div>
      {order?.products?.map((product) => (
        <OrderProductItem
          key={product.product._id}
          product={product}
          updatedDate={order.updatedAt}
          order={order}
        />
      ))}
    </div>
  );
};

export default OrderBlock;

const OrderAdressBlock = ({ address }) => {
  return (
    <div className="w-80 min-h-45 py-3 pl-4 pr-[3px] bg-white flex flex-col justify-between  border-[1px] border-gray-400 rounded-2xl">
      <div className="w-full">
        <h1 className="text-sm font-bold text-black">{address.name}</h1>
        <p className="leading-tight font-normal line-clamp-3">
          {address.description}
        </p>
        <p className="font-normal">
          {address.city}, {address.state} {address.pincode}
        </p>
        <p className="font-normal">{address.country}</p>
        <p className="font-normal">Phone number:{address.phonenumber}</p>
      </div>
    </div>
  );
};
