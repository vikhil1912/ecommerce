import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import OrderBlock from "./OrderBlock.jsx";
import { useState } from "react";

const YourOrder = ({ orders }) => {
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const yearOptions = [];
  for (let year = currentYear; year >= startYear; year--) {
    yearOptions.push(<option key={year}>{year}</option>);
  }
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const filteredOrders = orders.filter((order) => {
    if (selectedYear === "past 3 months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return new Date(order.createdAt) >= threeMonthsAgo;
    }
    const orderYear = new Date(order.createdAt).getFullYear();
    if (orderYear === parseInt(selectedYear)) {
      return true;
    }
    return false;
  });
  return (
    <div>
      <div className="flex items-center space-x-2 mt-2 text-sm">
        <span className="font-semibold">{filteredOrders?.length} orders</span>
        <span>placed in</span>
        <select
          className="border text-sm px-2 py-1 rounded bg-gray-100"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option>past 3 months</option>
          {yearOptions}
        </select>
      </div>
      {filteredOrders?.length > 0 ? (
        filteredOrders?.map((order) => (
          <OrderBlock key={order._id} order={order} />
        ))
      ) : (
        <p className="text-center text-gray-500">No orders found</p>
      )}
    </div>
  );
};

export default YourOrder;
