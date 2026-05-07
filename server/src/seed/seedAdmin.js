import { User } from "../models/User.js";

export async function seedAdmin({
	name = "System Admin",
	email = "admin@planmaster.app",
	password = "Admin123!",
} = {}) {
	const existing = await User.findOne({ email });

	if (existing) {
		if (existing.role !== "admin") {
			existing.role = "admin";
			await existing.save();
		}
		return existing;
	}

	return User.create({
		name,
		email,
		password,
		role: "admin",
	});
}
