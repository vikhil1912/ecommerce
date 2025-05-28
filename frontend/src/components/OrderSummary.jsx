import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../lib/axios.js";

const stripePromise = loadStripe(
  "pk_test_51RTcDhCt8mbxvNf1L456Pni1ED7Lm3uynaQbHBykS1qyJ5debByt3HW1AN5p8KfMcWeL5Ux9DoUtpSR2MkGZerQ4000LJvBBgd"
);

const OrderSummary = ({ products }) => {
  let totalprice = 0;
  products?.map((item) => {
    totalprice += item.product.price * item.quantity;
  });

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const response = await axiosInstance.post(
      "/payment/create-checkout-session",
      {
        products,
      }
    );
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
