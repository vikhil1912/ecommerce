import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const queryClient = useQueryClient();
  const { mutate: addToCartMutate, isPending } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/cart/${product._id}`);
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
  return (
    <div className="flex w-86  relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-35 w-76 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full z-50"
          src={product.image}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-2xl font-bold text-emerald-400">
              ${product.price}
            </span>
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          onClick={addToCartMutate}
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
