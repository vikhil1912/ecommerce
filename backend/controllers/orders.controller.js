import Order from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product")
      .populate("address");
    return res.json(orders);
  } catch (error) {
    console.log("Error in getAllOrders controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product");
    return res.json(orders);
  } catch (error) {
    console.log("Error in getAllAdminOrders controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) {
    console.log("Error in getOrderById controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, productId } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.products.forEach((product) => {
      if (product.product._id.toString() === productId.toString()) {
        product.status = status;
        product.updatedAt = new Date();
      }
    });
    await order.save();
    return res.json(order);
  } catch (error) {
    console.log("Error in updateOrderStatus controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId)
      return res.status(400).json({ message: "Order ID is required" });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const products = order.products;
    products.forEach((product) => {
      if (req.params.id === product.product.toString()) {
        product.status = "cancelled";
        product.updatedAt = new Date();
      }
    });
    order.products = products;
    await order.save();
    return res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.log("Error in cancelOrder controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
