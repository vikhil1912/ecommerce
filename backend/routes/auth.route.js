import { Router } from "express";
import {
  authSignupController,
  authLoginController,
  authLogoutController,
  refreshToken,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", authSignupController);

router.post("/login", authLoginController);

router.post("/logout", authLogoutController);

router.post("/refreshtoken", refreshToken);

export default router;
