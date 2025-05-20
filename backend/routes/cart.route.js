import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getCartProducts,
  addToCart,
  deleteFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", protectRoute, getCartProducts);
router.post("/:id", protectRoute, addToCart);
router.delete("/:id", protectRoute, deleteFromCart);
router.put("/increasequantity/:id", protectRoute, increaseQuantity);
router.put("/decreasequantity/:id", protectRoute, decreaseQuantity);

export default router;
