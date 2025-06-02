import React from "react";
import OrderBlock from "../components/OrderBlock.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import BuyAgain from "../components/BuyAgain";
import NotYetShipped from "../components/NotYetShipped.jsx";
import CancelledOrders from "../components/CancelledOrders.jsx";
import YourOrder from "../components/YourOrder.jsx";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [selectedTab, setSelectedTab] = React.useState("Orders");
  const queryClient = useQueryClient();
  const { data: allOrders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await axiosInstance.get("/order/");
    },
  });

  const orders = allOrders?.data
    ? [...allOrders.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];
  const tabs = [
    { name: "Orders", element: <YourOrder {...{ orders }} /> },
    { name: "Buy Again", element: <BuyAgain {...{ orders }} /> },
    { name: "Not Yet Shipped", element: <NotYetShipped {...{ orders }} /> },
    { name: "Cancelled Orders", element: <CancelledOrders {...{ orders }} /> },
  ];
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  return (
    <div className="bg-white min-h-screen flex flex-col gap-4 sm:px-25 md:px-40 lg:px-80   pt-10">
      <OrdersHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {tabs.map((tab) => {
        if (tab.name === selectedTab) return tab.element;
      })}
    </div>
  );
};

const OrdersHeader = ({ selectedTab, setSelectedTab }) => {
  const navigate = useNavigate();
  const tabs = [
    { name: "Orders" },
    { name: "Buy Again" },
    { name: "Not Yet Shipped" },
    { name: "Cancelled Orders" },
  ];

  return (
    <div className="w-full pb-2 mb-0 ">
      <nav className="w-full text-sm text-gray-500 mb-1">
        <span
          className="hover:text-blue-600 cursor-pointer hover:underline"
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </span>{" "}
        {">"} <span className="text-orange-600">Your Orders</span>
      </nav>

      <h1 className="text-2xl font-normal mb-2">Your Orders</h1>

      <div className="flex flex-wrap items-center justify-around w-full">
        {/* Tabs */}
        <div className="flex space-x-6 text-sm border-b border-gray-300 w-full mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`pb-1 cursor-pointer ${
                tab.name === selectedTab
                  ? "border-b-2 border-orange-500 text-black"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setSelectedTab(tab.name)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search all orders"
            className="h-9 w-64 rounded-sm border border-gray-300 text-sm px-2"
          />
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm">
            Search Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
