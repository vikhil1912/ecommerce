import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  console.log(`App is listening to the port:${port}`);
  connectDB();
});
