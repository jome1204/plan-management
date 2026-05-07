import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { scanPlanReminders } from "./jobs/reminderScanner.js";
import { seedAdmin } from "./seed/seedAdmin.js";

async function startServer() {
	try {
		await connectDatabase();
		await seedAdmin({
			name: env.adminName,
			email: env.adminEmail,
			password: env.adminPassword,
		});
		app.listen(env.port, () => {
			console.log(`Server running on port ${env.port}`);
		});

		setInterval(scanPlanReminders, 60000);
	} catch (error) {
		console.error("Failed to start server", error);
		process.exit(1);
	}
}

startServer();
