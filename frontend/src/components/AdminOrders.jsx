import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import OrderBlock from "./OrderBlock.jsx";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const { data: AllOrders, isLoading } = useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      return await axiosInstance.get("/order/admin-orders");
    },
  });
  //todo sort the items by createdAt date
  const orders = AllOrders?.data
    ? [...AllOrders.data] // sorting is not working
        .filter((order) => order.createdAt && !isNaN(new Date(order.createdAt)))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];
  return (
    <div className="bg-white min-h-screen">
      {orders?.map((order) => {
        return <OrderBlock key={order._id} order={order} isAdmin={true} />;
      })}
    </div>
  );
};

export default AdminOrders;
