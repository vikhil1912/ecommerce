import { Router } from "express";
import {
  authSignupController,
  authLoginController,
  authLogoutController,
  refreshToken,
  getUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", authSignupController);

router.post("/login", authLoginController);

router.post("/logout", protectRoute, authLogoutController);

router.post("/refreshtoken", refreshToken);

router.get("/user", protectRoute, getUser);

//Todo: implement getProfile

export default router;
