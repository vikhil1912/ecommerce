import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const OrderProductItem = ({ product, updatedDate, order }) => {
  const queryClient = useQueryClient();
  const { mutate: addToCartMutate, isPending } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/cart/${product.product._id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["userData1"] });
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      toast.success("Product added to cart");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  const { mutate: cancelOrderMutate } = useMutation({
    mutationFn: async () => {
      await axiosInstance.put(`/order/cancel/${product.product._id}`, {
        orderId: order._id,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  return (
    <div className="border-t mt-4 pt-4">
      <p className="font-medium text-lg mb-2">
        {product.status} at {new Date(product.updatedAt).toLocaleDateString()}
      </p>
      <div className="flex items-start space-x-4">
        <img
          src={product.product.image}
          alt="Fry Pan"
          className="size-30 object-contain"
        />
        <div>
          <p className="text-1xl text-black font-[500] mt-1">
            {product.product.name}
          </p>
          <p className="text-gray-500 text-sm font-medium">
            {product.product.description}
          </p>
          <p className="text-black font-medium text-lg mt-2">
            ₹{product.product.price}
          </p>
          <div className="flex mt-3 space-x-2">
            <button
              onClick={() => addToCartMutate()}
              className="h-9 font-[500] bg-yellow-400 hover:bg-yellow-300 cursor-pointer text-black px-4 py-1 text-sm rounded-md transition-colors duration-200"
            >
              Buy it again
            </button>
            <button
              onClick={() =>
                product.status !== "cancelled" && cancelOrderMutate()
              }
              variant="outline"
              className={`border ${
                product.status === "cancelled" && "bg-gray-200"
              } font-[500] border-gray-300 px-4 py-1 text-sm rounded-[7px] hover:bg-gray-200 transition-colors duration-200 ${
                product.status === "cancelled" &&
                "disabled:true cursor-not-allowed"
              }`}
            >
              {product.status === "cancelled" ? "Cancelled" : "Cancel Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProductItem;
