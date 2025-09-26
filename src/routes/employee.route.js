import { Router } from "express";
import { getAllEmployees, saveEmployee } from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";

const router = Router();

router.get("/", authMiddleware, allowRoles("admin"), getAllEmployees);
router.post("/save", authMiddleware, allowRoles("admin"), saveEmployee);

export default router
