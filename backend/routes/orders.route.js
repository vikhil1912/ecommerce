import { Router } from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  getAllOrders,
  getAllAdminOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orders.controller.js";

const router = Router();

router.get("/", protectRoute, getAllOrders);
router.get("/admin-orders", protectRoute, adminRoute, getAllAdminOrders);
router.get("/:id", protectRoute, getOrderById);
router.put("/cancel/:id", protectRoute, cancelOrder);
router.put("/:id", protectRoute, adminRoute, updateOrderStatus);

export default router;
