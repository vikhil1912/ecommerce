import Router from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendations,
  getProductsByCategory,
  toogleIsFeatured,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/createproduct", protectRoute, adminRoute, createProduct);
router.delete("/delete/:id", protectRoute, adminRoute, deleteProduct);
router.get("/recommendations", getRecommendations);
router.get("/category/:category", getProductsByCategory);
router.put("/:id", protectRoute, adminRoute, toogleIsFeatured);

export default router;
