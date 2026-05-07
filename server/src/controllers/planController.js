import { Plan } from "../models/Plan.js";

export async function listPlans(request, response) {
	const plans = await Plan.find({ user: request.user._id }).sort({ dueDate: 1 });
	return response.json({ plans });
}

export async function createPlan(request, response) {
	const plan = await Plan.create({
		...request.body,
		user: request.user._id,
	});

	return response.status(201).json({ plan });
}

export async function updatePlan(request, response) {
	const plan = await Plan.findOneAndUpdate(
		{ _id: request.params.id, user: request.user._id },
		request.body,
		{ new: true, runValidators: true },
	);

	if (!plan) {
		return response.status(404).json({ message: "Plan not found." });
	}

	return response.json({ plan });
}

export async function removePlan(request, response) {
	const plan = await Plan.findOneAndDelete({
		_id: request.params.id,
		user: request.user._id,
	});

	if (!plan) {
		return response.status(404).json({ message: "Plan not found." });
	}

	return response.status(204).send();
}
