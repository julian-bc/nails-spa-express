import { Router } from "express";
import { getAllLocations, addEmployeesToLocation, getLocationById } from "../controllers/location.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";

const router = Router();

router.get("/", getAllLocations);
router.post("/:id/employees", authMiddleware, allowRoles("admin"), addEmployeesToLocation);
router.get("/:id", getLocationById);

export default router