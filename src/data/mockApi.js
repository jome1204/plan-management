const STORAGE_KEY = "plan-master-store";
const SESSION_KEY = "plan-master-session";

const demoData = {
	users: [
		{
			id: "admin-1",
			name: "System Admin",
			email: "admin@planmaster.app",
			password: "Admin123!",
			role: "admin",
			plans: [],
		},
		{
			id: "user-1",
			name: "Demo User",
			email: "user@planmaster.app",
			password: "User123!",
			role: "user",
			plans: [
				{
					id: "plan-1",
					title: "Prepare project proposal",
					details: "Draft the system scope, timeline, and MVP priorities.",
					category: "Work",
					priority: "High",
					dueDate: "2026-05-08T16:00:00.000Z",
					alarmAt: "2026-05-08T12:00:00.000Z",
					inputType: "text",
					textContent: "Focus on the dashboard, auth, and notification flow.",
					voiceUrl: "",
					videoUrl: "",
					status: "active",
					createdAt: "2026-05-04T10:00:00.000Z",
					updatedAt: "2026-05-04T10:00:00.000Z",
				},
				{
					id: "plan-2",
					title: "Review API endpoints",
					details: "Verify the plan CRUD endpoints before deployment.",
					category: "Learning",
					priority: "Medium",
					dueDate: "2026-05-01T13:00:00.000Z",
					alarmAt: "2026-04-30T11:00:00.000Z",
					inputType: "voice",
					textContent: "",
					voiceUrl: "https://example.com/voice-note",
					videoUrl: "",
					status: "active",
					createdAt: "2026-04-28T08:00:00.000Z",
					updatedAt: "2026-04-28T08:00:00.000Z",
				},
				{
					id: "plan-3",
					title: "Ship homepage refresh",
					details: "Publish the updated landing page and verify responsive layout.",
					category: "Work",
					priority: "Medium",
					dueDate: "2026-05-02T09:00:00.000Z",
					alarmAt: "2026-05-02T07:00:00.000Z",
					inputType: "video",
					textContent: "",
					voiceUrl: "",
					videoUrl: "https://example.com/video-demo",
					status: "completed",
					createdAt: "2026-05-01T08:00:00.000Z",
					updatedAt: "2026-05-02T10:30:00.000Z",
				},
			],
		},
	],
};

function ensureStore() {
	const existing = window.localStorage.getItem(STORAGE_KEY);
	if (!existing) {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
	}
}

function readStore() {
	ensureStore();
	return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
}

function writeStore(store) {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function writeSession(session) {
	window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function deriveStatus(plan) {
	if (plan.status === "completed") {
		return "completed";
	}

	if (plan.dueDate && new Date(plan.dueDate).getTime() < Date.now()) {
		return "overdue";
	}

	return "active";
}

function normalizePlanPayload(payload) {
	return {
		title: payload.title.trim(),
		details: payload.details.trim(),
		category: payload.category,
		priority: payload.priority,
		dueDate: payload.dueDate ? new Date(payload.dueDate).toISOString() : "",
		alarmAt: payload.alarmAt ? new Date(payload.alarmAt).toISOString() : "",
		inputType: payload.inputType,
		textContent: payload.textContent?.trim() ?? "",
		voiceUrl: payload.voiceUrl?.trim() ?? "",
		videoUrl: payload.videoUrl?.trim() ?? "",
	};
}

function sanitizeUser(user) {
	return {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};
}

export function registerUser(form) {
	const store = readStore();
	const exists = store.users.some(
		(user) => user.email.toLowerCase() === form.email.toLowerCase(),
	);

	if (exists) {
		throw new Error("An account with that email already exists.");
	}

	const user = {
		id: crypto.randomUUID(),
		name: form.name.trim(),
		email: form.email.trim(),
		password: form.password,
		role: "user",
		plans: [],
	};

	store.users.push(user);
	writeStore(store);
	writeSession(sanitizeUser(user));
	return sanitizeUser(user);
}

export function loginUser(form) {
	const store = readStore();
	const user = store.users.find(
		(item) =>
			item.email.toLowerCase() === form.email.toLowerCase() &&
			item.password === form.password,
	);

	if (!user) {
		throw new Error("Invalid email or password.");
	}

	const session = sanitizeUser(user);
	writeSession(session);
	return session;
}

export function logoutUser() {
	window.localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
	const raw = window.localStorage.getItem(SESSION_KEY);
	return raw ? JSON.parse(raw) : null;
}

export function getDashboardSnapshot(userId) {
	const store = readStore();
	const user = store.users.find((item) => item.id === userId);
	if (!user) {
		throw new Error("User not found.");
	}

	const plans = user.plans
		.map((plan) => ({ ...plan, derivedStatus: deriveStatus(plan) }))
		.sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate));
	const summary = {
		total: plans.length,
		completed: plans.filter((plan) => plan.status === "completed").length,
		overdue: plans.filter((plan) => plan.derivedStatus === "overdue").length,
	};
	const upcoming = plans
		.filter(
			(plan) =>
				plan.status !== "completed" &&
				plan.alarmAt &&
				new Date(plan.alarmAt).getTime() > Date.now(),
		)
		.sort((left, right) => new Date(left.alarmAt) - new Date(right.alarmAt));

	return {
		user: sanitizeUser(user),
		plans,
		summary,
		upcoming,
	};
}

export function createPlan(userId, payload) {
	const store = readStore();
	const user = store.users.find((item) => item.id === userId);
	if (!user) {
		throw new Error("User not found.");
	}

	const normalized = normalizePlanPayload(payload);
	user.plans.push({
		id: crypto.randomUUID(),
		...normalized,
		status: "active",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	});
	writeStore(store);
}

export function savePlan(userId, planId, payload) {
	const store = readStore();
	const user = store.users.find((item) => item.id === userId);
	if (!user) {
		throw new Error("User not found.");
	}

	user.plans = user.plans.map((plan) => {
		if (plan.id !== planId) {
			return plan;
		}

		const normalized = normalizePlanPayload(payload);
		return {
			...plan,
			...normalized,
			status: payload.status ?? plan.status,
			updatedAt: new Date().toISOString(),
		};
	});
	writeStore(store);
}

export function deletePlan(userId, planId) {
	const store = readStore();
	const user = store.users.find((item) => item.id === userId);
	if (!user) {
		throw new Error("User not found.");
	}

	user.plans = user.plans.filter((plan) => plan.id !== planId);
	writeStore(store);
}

export function getAdminOverview() {
	const store = readStore();
	const users = store.users
		.filter((user) => user.role === "user")
		.map((user) => {
			const plans = user.plans.map((plan) => ({
				...plan,
				derivedStatus: deriveStatus(plan),
			}));
			return {
				id: user.id,
				name: user.name,
				email: user.email,
				totalPlans: plans.length,
				completedPlans: plans.filter((plan) => plan.status === "completed")
					.length,
				overduePlans: plans.filter((plan) => plan.derivedStatus === "overdue")
					.length,
			};
		});

	return {
		users,
		summary: {
			users: users.length,
			totalPlans: users.reduce((sum, user) => sum + user.totalPlans, 0),
			completed: users.reduce((sum, user) => sum + user.completedPlans, 0),
			overdue: users.reduce((sum, user) => sum + user.overduePlans, 0),
		},
	};
}
