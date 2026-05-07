import cors from "cors";
import express from "express";
import morgan from "morgan";

import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
	cors({
		origin: env.clientUrl,
		credentials: true,
	}),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (request, response) => {
	return response.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/plans", requireAuth, planRoutes);
app.use("/api/admin", requireAuth, adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
