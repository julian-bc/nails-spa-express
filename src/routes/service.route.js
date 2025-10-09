import { Router } from "express";
import { getAllServices, addStaffToService, getServiceById } from "../controllers/service.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";

const router = Router();

router.get("/", getAllServices);
router.post("/:id/staff", authMiddleware, allowRoles("admin"), addStaffToService);
router.get("/:id", getServiceById);

export default router