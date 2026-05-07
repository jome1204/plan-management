import { Router } from "express";

import {
	createPlan,
	listPlans,
	removePlan,
	updatePlan,
} from "../controllers/planController.js";

const router = Router();

router.get("/", listPlans);
router.post("/", createPlan);
router.patch("/:id", updatePlan);
router.delete("/:id", removePlan);

export default router;
