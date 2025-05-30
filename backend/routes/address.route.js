import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  addAddress,
  deleteAddress,
  updateAddress,
  getAllAddresses,
  getAddressById,
} from "../controllers/address.controller.js";

const router = Router();

router.post("/", protectRoute, addAddress);
router.delete("/:id", protectRoute, deleteAddress);
router.put("/:id", protectRoute, updateAddress);
router.get("/", protectRoute, getAllAddresses);
router.get("/:id", protectRoute, getAddressById);

export default router;
