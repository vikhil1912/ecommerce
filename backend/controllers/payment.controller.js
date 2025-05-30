import { stripe } from "../lib/stripe.js";
import "dotenv/config";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, address } = req.body;

    if (!Array.isArray(products) || products.length == 0) {
      return res.status(401).json({ message: "Inavalid products Array" });
    }

    let total_amount = 0;
    let lineItems = products.map((product) => {
      const amount = Math.round(product.product.price * 100);
      total_amount += amount;
      return {
        price_data: {
          currency: "INR",
          product_data: {
            name: product.product.name,
            images: [product.product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      metadata: {
        userId: req.user._id.toString(),
        products: JSON.stringify(
          products.map((product) => {
            return {
              id: product.product._id,
              quantity: product.quantity,
              price: product.product.price,
            };
          })
        ),
        address: address._id.toString(),
      },
    });

    res.status(200).json({ id: session.id, totalamount: total_amount / 100 });
  } catch (error) {
    console.log("Error in createcheckoutsession controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status == "paid") {
      const isExist = await Order.findOne({ stripeSessionId: sessionId });
      if (isExist) {
        return res.status(400).json({ message: "Order already placed" });
      }
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => {
          return {
            product: product.id,
            price: product.price,
            quantity: product.quantity,
          };
        }),
        address: session.metadata.address,
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
      });
      await newOrder.save();
      return res.status(200).json({
        message: "Payment Successfull and Order created",
        orderId: newOrder._id,
      });
    }
    return res.status(401).json({ message: "paymentFailed" });
  } catch (error) {
    console.log("Error in checkoutSuccess controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
