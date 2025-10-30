import { Router } from "express";
import { recoveryPass, setPass } from "../controllers/recovery.controller.js";

const router = Router();

router.post("/generate", recoveryPass);
router.post("/", setPass);

export default router
