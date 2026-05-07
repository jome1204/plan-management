import { Plan } from "../models/Plan.js";

export async function scanPlanReminders() {
	const now = new Date();
	const duePlans = await Plan.find({
		status: "active",
		alarmAt: { $lte: now },
		$or: [
			{ lastReminderSentAt: { $exists: false } },
			{ lastReminderSentAt: null },
		],
	}).populate("user", "name email");

	for (const plan of duePlans) {
		plan.lastReminderSentAt = now;
		await plan.save();
		console.log(
			`Reminder ready for ${plan.user.email}: ${plan.title} at ${now.toISOString()}`,
		);
	}
}
