import { Router } from "express";
import { 
    createAppointment,
    getAvailabilityForServiceInLocation,
    getAppointments,
    getAppointmentsByEmployee, 
    getAppointmentsByUser,
    deleteAppointment 
    } from "../controllers/citas.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";


const router = Router();

router.get("/", authMiddleware, allowRoles("admin", "employee"), getAppointments);
router.get("/employee/:id", authMiddleware, allowRoles("admin", "employee"), getAppointmentsByEmployee);
router.get("/user/:id", getAppointmentsByUser);
router.post("/", authMiddleware, allowRoles("admin", "employee"), createAppointment);
router.post("/availability", getAvailabilityForServiceInLocation);
router.delete("/:id", authMiddleware, deleteAppointment);

export default router