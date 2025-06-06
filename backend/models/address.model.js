import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: Number,
      required: true,
    },
    instructions: {
      type: String,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("address", schema);

export const addressSchema = schema;

export default model;
