import { Router } from "express";
import { getAllServices, addStaffToService } from "../controllers/service.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";

const router = Router();

router.get("/", getAllServices);
router.post("/:id/staff", authMiddleware, allowRoles("admin"), addStaffToService);

export default router