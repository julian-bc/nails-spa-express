import { Router } from "express";
import { deleteById, getAllCustomers, update } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { allowRoles } from "../middlewares/allowRoles.middleware.js";

const router = Router();

router.get("/customers", authMiddleware, allowRoles("admin", "employee"), getAllCustomers);
router.put("/:id", authMiddleware, allowRoles("admin"), update);
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteById);

export default router
