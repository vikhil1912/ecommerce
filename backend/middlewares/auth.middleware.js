import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return res.status(401).json({ message: "Unauthorised" });
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      decoded = null;
    }
    if (!decoded) return res.status(401).json({ message: "Invalid Token" });
    const user = await User.findOne({ _id: decoded.userId }).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    console.log("error in protectRoute middleware", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const adminRoute = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") return next();
    return res.status(403).json({ message: "You are not an admin" });
  } catch (error) {
    console.log("error in protectRoute middleware", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
