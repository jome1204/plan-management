import { Plan } from "../models/Plan.js";
import { User } from "../models/User.js";

export async function getAdminOverview(request, response) {
	const users = await User.find({ role: "user" }).select("name email role");
	const plans = await Plan.find().populate("user", "name email");

	const overviewUsers = users.map((user) => {
		const userPlans = plans.filter(
			(plan) => plan.user?._id.toString() === user._id.toString(),
		);
		return {
			id: user._id,
			name: user.name,
			email: user.email,
			totalPlans: userPlans.length,
			completedPlans: userPlans.filter((plan) => plan.status === "completed")
				.length,
			overduePlans: userPlans.filter((plan) => plan.derivedStatus === "overdue")
				.length,
		};
	});

	return response.json({
		users: overviewUsers,
		summary: {
			users: overviewUsers.length,
			totalPlans: overviewUsers.reduce((sum, user) => sum + user.totalPlans, 0),
			completed: overviewUsers.reduce(
				(sum, user) => sum + user.completedPlans,
				0,
			),
			overdue: overviewUsers.reduce((sum, user) => sum + user.overduePlans, 0),
		},
	});
}
