import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import paymentRoutes from "./routes/payment.route.js";
import addressRoutes from "./routes/address.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL.replace(/\/$/, ""),
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/address", addressRoutes);

app.listen(port, () => {
  console.log(`App is listening to the port:${port}`);
  connectDB();
});
