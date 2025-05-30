import Address from "../models/address.model.js";
import User from "../models/user.model.js";

export const addAddress = async (req, res) => {
  try {
    const { name, description, city, state, pincode, country, phonenumber } =
      req.body;
    let { instructions } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (
      !name ||
      !description ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !phonenumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!instructions) instructions = "";
    const newAddress = await Address({
      userId,
      name,
      description,
      city,
      state,
      pincode,
      country,
      phonenumber,
      instructions,
    });
    await newAddress.save();
    user.addresses.push(newAddress._id);
    await user.save();
    return res.json({ message: "Address added successfully" });
  } catch (error) {
    console.log("Error in addAddress controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address.findOneAndDelete({ _id: id });
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (id1) => id1.toString() !== id.toString()
    );
    await user.save();
    return res.json({ message: "Address deleted" });
  } catch (error) {
    console.log("Error in deleteAddress controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      "name",
      "description",
      "city",
      "state",
      "pincode",
      "country",
      "phonenumber",
      "instructions",
    ];
    const updateField = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        updateField[field] = req.body[field];
      }
    }
    const address = await Address.findByIdAndUpdate(id, { $set: updateField });
    await address.save();
    return res.json({ message: "Address updated" });
  } catch (error) {
    console.log("Error in updateAddress controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("addresses");
    return res.json(user.addresses);
  } catch (error) {
    console.log("Error in getAllAddresses controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);
    res.json(address);
  } catch (error) {
    console.log("Error in getAddressById controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
