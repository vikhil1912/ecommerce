import User from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "cartItems.product"
    );
    return res.json(user.cartItems);
  } catch (error) {
    console.log("error in getCartProducts controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const isExists = user.cartItems.find(
      (item) => item.product.toString() === id
    );
    if (isExists) {
      isExists.quantity += 1;
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() != id
      );
      user.cartItems = [...user.cartItems, isExists];
    } else {
      user.cartItems.push({ product: id });
    }
    await user.save();
    res.json({ message: "product added to cart" });
  } catch (error) {
    console.log("error in addtocart controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    user.cartItems = user.cartItems.filter(
      (item) => item.product.toString() !== id
    );
    await user.save();
    res.json({ message: "product removed from the cart" });
  } catch (error) {
    console.log("error in deletefromcart controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const increaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const item = user.cartItems.find((i) => i.product.toString() === id);
    if (item) {
      item.quantity += 1;
    }
    await user.save();
    res.json({ message: "increased quantity by one" });
  } catch (error) {
    console.log("error in increaseQuantity controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const decreaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const item = user.cartItems.find((i) => i.product.toString() === id);
    if (item) {
      if (item.quantity == 0)
        user.cartItems = user.cartItems.filter(
          (i) => i.product.toString() != id
        );
      else item.quantity -= 1;
    }
    await user.save();
    res.json({ message: "decreased quantity by one" });
  } catch (error) {
    console.log("error in decreaseQuantity controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
