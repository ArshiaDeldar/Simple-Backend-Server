import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { getMe } from "../controllers/authController.js";
import requireAuth from "../middleware/requireAuth.js";
import { logout } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.post("/logout", logout);

export default router;
