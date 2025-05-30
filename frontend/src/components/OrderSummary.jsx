import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../lib/axios.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  "pk_test_51RTcDhCt8mbxvNf1L456Pni1ED7Lm3uynaQbHBykS1qyJ5debByt3HW1AN5p8KfMcWeL5Ux9DoUtpSR2MkGZerQ4000LJvBBgd"
);

const OrderSummary = ({ products }) => {
  const [address, setAddress] = useState("");
  const queryClient = useQueryClient();
  const { data: allAddressesQuery, isLoading } = useQuery({
    queryKey: ["allAddress"],
    queryFn: async () => await axiosInstance.get("/address/"),
  });
  const addresses = allAddressesQuery?.data;
  let totalprice = 0;
  products?.map((item) => {
    totalprice += item.product.price * item.quantity;
  });

  const handlePayment = async () => {
    if (!address) {
      toast.error("Address field is required");
      return;
    }
    const add = addresses.filter((a) => a.description === address);
    setAddress(add[0]);
    const stripe = await stripePromise;
    const response = await axiosInstance.post(
      "/payment/create-checkout-session",
      {
        products,
        address: add[0],
      }
    );
    setAddress("");
    const sessionId = response.data.id;
    const result = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });
    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">${totalprice}</dd>
          </dl>
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${totalprice}
            </dd>
          </dl>
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Address
          </label>
          <select
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select an Address</option>
            {addresses?.map((address) => (
              <option key={address._id} value={address.description}>
                {address.description}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
