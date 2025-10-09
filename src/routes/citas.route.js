import { Router } from "express";
import { createAppointment, getAvailabilityForServiceInLocation } from "../controllers/citas.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";


const router = Router();

router.post("/", authMiddleware, allowRoles("admin", "employee"), createAppointment);
router.post("/availability", getAvailabilityForServiceInLocation);


export default router