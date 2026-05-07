const TOKEN_KEY = "plan-master-token";
const SESSION_KEY = "plan-master-session";

function readJson(key) {
	const raw = window.localStorage.getItem(key);
	return raw ? JSON.parse(raw) : null;
}

function saveSession(token, user) {
	window.localStorage.setItem(TOKEN_KEY, token);
	window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
	window.localStorage.removeItem(TOKEN_KEY);
	window.localStorage.removeItem(SESSION_KEY);
}

async function request(path, options = {}) {
	const token = window.localStorage.getItem(TOKEN_KEY);
	const headers = {
		"Content-Type": "application/json",
		...(options.headers || {}),
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(path, {
		...options,
		headers,
	});

	if (response.status === 204) {
		return null;
	}

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Request failed.");
	}

	return data;
}

function deriveStatus(plan) {
	if (plan.status === "completed") {
		return "completed";
	}

	return plan.dueDate && new Date(plan.dueDate).getTime() < Date.now()
		? "overdue"
		: "active";
}

function buildDashboardSnapshot(user, plans) {
	const preparedPlans = plans
		.map((plan) => ({ ...plan, id: plan._id || plan.id, derivedStatus: deriveStatus(plan) }))
		.sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate));

	return {
		user,
		plans: preparedPlans,
		summary: {
			total: preparedPlans.length,
			completed: preparedPlans.filter((plan) => plan.status === "completed").length,
			overdue: preparedPlans.filter((plan) => plan.derivedStatus === "overdue").length,
		},
		upcoming: preparedPlans
			.filter(
				(plan) =>
					plan.status !== "completed" &&
					plan.alarmAt &&
					new Date(plan.alarmAt).getTime() > Date.now(),
			)
			.sort((left, right) => new Date(left.alarmAt) - new Date(right.alarmAt)),
	};
}

export function getStoredSession() {
	return readJson(SESSION_KEY);
}

export function hasStoredToken() {
	return Boolean(window.localStorage.getItem(TOKEN_KEY));
}

export async function syncCurrentUser() {
	const result = await request("/api/auth/me");
	window.localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
	return result.user;
}

export async function loginUser(form) {
	const result = await request("/api/auth/login", {
		method: "POST",
		body: JSON.stringify(form),
	});
	saveSession(result.token, result.user);
	return result.user;
}

export async function registerUser(form) {
	const result = await request("/api/auth/register", {
		method: "POST",
		body: JSON.stringify(form),
	});
	saveSession(result.token, result.user);
	return result.user;
}

export function logoutUser() {
	clearSession();
}

export async function getDashboardSnapshot() {
	const user = getStoredSession();
	const result = await request("/api/plans");
	return buildDashboardSnapshot(user, result.plans);
}

export async function createPlan(payload) {
	await request("/api/plans", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function savePlan(planId, payload) {
	await request(`/api/plans/${planId}`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
}

export async function deletePlan(planId) {
	await request(`/api/plans/${planId}`, {
		method: "DELETE",
	});
}

export async function getAdminOverview() {
	const result = await request("/api/admin/overview");
	return result;
}
