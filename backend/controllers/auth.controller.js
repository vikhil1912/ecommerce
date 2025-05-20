import express from "express";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const storeRefreshTokenToDB = async (user, refreshToken) => {
  const newToken = new Token({
    userId: user._id,
    refreshToken: refreshToken,
  });
  await newToken.save();
};

export const authSignupController = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "user already exists" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "password must be of atleast 6 characters" });
    const newUser = new User({ email, password, name });
    const { accessToken, refreshToken } = generateTokens(newUser._id);
    setCookies(res, accessToken, refreshToken);
    await storeRefreshTokenToDB(newUser, refreshToken);
    await newUser.save();
    return res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    console.log("error in authSignupController", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User doesn't exist" });
    const isToken = await Token.findOne({ userId: user._id });
    if (isToken)
      return res.status(400).json({ message: "User already logged in" });
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect)
      return res.status(401).json({ message: "Invalid credintials" });
    const { accessToken, refreshToken } = generateTokens(user._id);
    setCookies(res, accessToken, refreshToken);
    await storeRefreshTokenToDB(user, refreshToken);
    return res.status(200).json({ message: "user logged in successfully" });
  } catch (error) {
    console.log("error in authLoginController", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authLogoutController = async (req, res) => {
  try {
    //Todo: pass protect middleware
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "Invalid token" });
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await Token.findOneAndDelete({ userId: decoded.userId });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "logged out successfully" });
  } catch (error) {
    console.log("error in authLogoutController", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "no refres token provided" });
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Invalid refresh token" });
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) return res.status(401).json({ message: "Invalid user" });
    const userToken = await Token.findOne({ userId: user._id });
    if (refreshToken !== userToken.refreshToken)
      return res.status(401).json({ message: "Invalid refresh token" });
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("error in refreshtoken", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Todo: implement getProfile
