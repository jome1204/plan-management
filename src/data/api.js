import * as mockApi from "./mockApi";

const TOKEN_KEY = "plan-master-token";
const SESSION_KEY = "plan-master-session";
const API_BASE_URL = process.env.REACT_APP_API_URL || "";
const USE_MOCK_API = !API_BASE_URL;

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
	const url = `${API_BASE_URL}${path}`;
	const headers = {
		"Content-Type": "application/json",
		...(options.headers || {}),
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(url, {
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
	return USE_MOCK_API
		? Boolean(mockApi.getCurrentUser())
		: Boolean(window.localStorage.getItem(TOKEN_KEY));
}

export async function syncCurrentUser() {
	if (USE_MOCK_API) {
		const user = mockApi.getCurrentUser();
		if (!user) {
			throw new Error("No active session.");
		}
		return user;
	}

	const result = await request("/api/auth/me");
	window.localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
	return result.user;
}

export async function loginUser(form) {
	if (USE_MOCK_API) {
		return mockApi.loginUser(form);
	}

	const result = await request("/api/auth/login", {
		method: "POST",
		body: JSON.stringify(form),
	});
	saveSession(result.token, result.user);
	return result.user;
}

export async function registerUser(form) {
	if (USE_MOCK_API) {
		return mockApi.registerUser(form);
	}

	const result = await request("/api/auth/register", {
		method: "POST",
		body: JSON.stringify(form),
	});
	saveSession(result.token, result.user);
	return result.user;
}

export function logoutUser() {
	if (USE_MOCK_API) {
		mockApi.logoutUser();
		return;
	}

	clearSession();
}

export async function getDashboardSnapshot() {
	const user = getStoredSession();
	if (USE_MOCK_API) {
		return mockApi.getDashboardSnapshot(user.userId);
	}

	const result = await request("/api/plans");
	return buildDashboardSnapshot(user, result.plans);
}

export async function createPlan(payload) {
	if (USE_MOCK_API) {
		const user = getStoredSession();
		mockApi.createPlan(user.userId, payload);
		return;
	}

	await request("/api/plans", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function savePlan(planId, payload) {
	if (USE_MOCK_API) {
		const user = getStoredSession();
		mockApi.savePlan(user.userId, planId, payload);
		return;
	}

	await request(`/api/plans/${planId}`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
}

export async function deletePlan(planId) {
	if (USE_MOCK_API) {
		const user = getStoredSession();
		mockApi.deletePlan(user.userId, planId);
		return;
	}

	await request(`/api/plans/${planId}`, {
		method: "DELETE",
	});
}

export async function getAdminOverview() {
	if (USE_MOCK_API) {
		return mockApi.getAdminOverview();
	}

	const result = await request("/api/admin/overview");
	return result;
}
