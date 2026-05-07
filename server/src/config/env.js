import dotenv from "dotenv";

dotenv.config();

export const env = {
	port: process.env.PORT || 5000,
	mongoUri:
		process.env.MONGO_URI || "mongodb://127.0.0.1:27017/planmaster",
	jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
	clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
	adminName: process.env.ADMIN_NAME || "System Admin",
	adminEmail: process.env.ADMIN_EMAIL || "admin@planmaster.app",
	adminPassword: process.env.ADMIN_PASSWORD || "Admin123!",
};
