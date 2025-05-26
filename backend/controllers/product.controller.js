import express from "express";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log("error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });
    res.json(products);
  } catch (error) {
    console.log("error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    if (!name || !description || !price || !category || !image)
      return res.status(400).json({ message: "All fields are required" });
    if (price < 0)
      return res
        .status(400)
        .json({ message: "Price must be of a positive value" });
    let imageResult;
    if (image) {
      imageResult = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = new Product({
      name,
      description,
      price,
      category,
      image: imageResult?.secure_url ? imageResult.secure_url : "",
    });
    await product.save();
    return res.status(201).json({ message: "product created successfully" });
  } catch (error) {
    console.log("error in createProduct controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.image) {
      const proId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${proId}`);
      } catch (error) {
        console.log("error occured while deleting in cloudinary");
      }
    }
    await Product.findByIdAndDelete(id);
    return res.json({ message: "product deleted successfully" });
  } catch (error) {
    console.log("error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const products = await Product.find({}).limit(5);
    return res.json(products);
  } catch (error) {
    console.log("error in getRecommendations controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    return res.json(products);
  } catch (error) {
    console.log("error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toogleIsFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      await product.save();
    }
    return res.json({ message: "Toggled is isFeatured" });
  } catch (error) {
    console.log("error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
