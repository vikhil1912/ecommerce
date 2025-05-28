import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getCartProducts,
  addToCart,
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", protectRoute, getCartProducts);
router.post("/:id", protectRoute, addToCart);
router.delete("/:id", protectRoute, deleteFromCart);
router.put("/increasequantity/:id", protectRoute, increaseQuantity);
router.put("/decreasequantity/:id", protectRoute, decreaseQuantity);
router.put("/clear", protectRoute, clearCart);

export default router;
