import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
    ],
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log("error while saving to db in user model");
    return next(error);
  }
});

const userModel = mongoose.model("user", schema);
export default userModel;
