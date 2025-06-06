import mongoose from "mongoose";
import { addressSchema } from "./address.model.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: [
            "placed",
            "shipped",
            "outfordelivery",
            "delivered",
            "cancelled",
          ],
          default: "placed",
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
    address: addressSchema,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
