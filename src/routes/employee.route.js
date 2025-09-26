import { Router } from "express";
import { saveEmployee } from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

router.post("/save", authMiddleware, adminMiddleware, saveEmployee);

export default router
