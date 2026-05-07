import { Router } from "express";

import { getAdminOverview } from "../controllers/adminController.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/overview", requireRole("admin"), getAdminOverview);

export default router;
