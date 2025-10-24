import { Router } from "express";
import { check, login, logout, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check", check);

export default router
