import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import {
	createPlan,
	deletePlan,
	getAdminOverview,
	getDashboardSnapshot,
	getStoredSession,
	hasStoredToken,
	loginUser,
	logoutUser,
	registerUser,
	savePlan,
	syncCurrentUser,
} from "./data/api";
import "./app.css";

const emptyPlan = {
	title: "",
	details: "",
	category: "Personal",
	priority: "Medium",
	dueDate: "",
	alarmAt: "",
	inputType: "text",
	textContent: "",
	voiceUrl: "",
	videoUrl: "",
};

function App() {
	const [session, setSession] = useState(() => getStoredSession());
	const [booting, setBooting] = useState(() => hasStoredToken());

	useEffect(() => {
		if (!hasStoredToken()) {
			setBooting(false);
			return;
		}

		let active = true;
		syncCurrentUser()
			.then((user) => {
				if (active) {
					setSession(user);
				}
			})
			.catch(() => {
				logoutUser();
				if (active) {
					setSession(null);
				}
			})
			.finally(() => {
				if (active) {
					setBooting(false);
				}
			});

		return () => {
			active = false;
		};
	}, []);

	const refreshSession = () => {
		setSession(getStoredSession());
	};

	if (booting) {
		return <ScreenMessage title="Loading workspace" body="Checking your session..." />;
	}

	return (
		<Routes>
			<Route
				path="/"
				element={
					session ? (
						<Navigate
							to={session.role === "admin" ? "/admin" : "/dashboard"}
							replace
						/>
					) : (
						<LandingPage />
					)
				}
			/>
			<Route
				path="/login"
				element={
					session ? (
						<Navigate
							to={session.role === "admin" ? "/admin" : "/dashboard"}
							replace
						/>
					) : (
						<LoginPage onLogin={refreshSession} />
					)
				}
			/>
			<Route
				path="/register"
				element={
					session ? (
						<Navigate
							to={session.role === "admin" ? "/admin" : "/dashboard"}
							replace
						/>
					) : (
						<RegisterPage onRegister={refreshSession} />
					)
				}
			/>
			<Route
				path="/dashboard"
				element={
					session?.role === "user" ? (
						<DashboardPage session={session} onLogout={refreshSession} />
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
			<Route
				path="/admin"
				element={
					session?.role === "admin" ? (
						<AdminPage onLogout={refreshSession} />
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

function LandingPage() {
	const navigate = useNavigate();

	return (
		<div className="app-shell marketing-shell">
			<section className="marketing-hero">
				<div className="marketing-copy">
					<span className="eyebrow">MERN plan management system</span>
					<h1>Keep every plan, reminder, and result in one focused workspace.</h1>
					<p>
						This product combines personal planning, alarm-based reminders,
						completed and overdue tracking, and an admin overview of all users
						and their plans.
					</p>
					<div className="hero-actions">
						<button
							type="button"
							className="primary-button"
							onClick={() => navigate("/register")}
						>
							Create account
						</button>
						<button
							type="button"
							className="secondary-button"
							onClick={() => navigate("/login")}
						>
							Login
						</button>
					</div>
				</div>

				<div className="marketing-panel">
					<div className="metric-card">
						<span className="metric-label">Built for</span>
						<strong>Users and admin teams</strong>
					</div>
					<div className="metric-card">
						<span className="metric-label">Plan inputs</span>
						<strong>Text, voice links, and video links</strong>
					</div>
					<div className="metric-card">
						<span className="metric-label">Workflow</span>
						<strong>Create, edit, complete, reopen, delete</strong>
					</div>
				</div>
			</section>

			<section className="marketing-grid">
				<FeatureCard
					title="Smart reminders"
					body="Each plan can carry a due date and alarm timestamp so users can track commitments before they become overdue."
				/>
				<FeatureCard
					title="Status visibility"
					body="Separate views for active, completed, and overdue plans make progress easy to understand at a glance."
				/>
				<FeatureCard
					title="Admin oversight"
					body="Admins can review all users, inspect plan totals, and spot overdue work across the whole system."
				/>
			</section>
		</div>
	);
}

function LoginPage({ onLogin }) {
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const submit = async (event) => {
		event.preventDefault();
		setSubmitting(true);
		setError("");

		try {
			const user = await loginUser(form);
			onLogin();
			navigate(user.role === "admin" ? "/admin" : "/dashboard");
		} catch (loginError) {
			setError(loginError.message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<AuthLayout
			title="Welcome back"
			subtitle="Sign in to manage your plans, alarms, and progress."
		>
			<form className="auth-form" onSubmit={submit}>
				<label>
					<span>Email</span>
					<input
						type="email"
						value={form.email}
						onChange={(event) =>
							setForm({ ...form, email: event.target.value })
						}
						placeholder="you@example.com"
						required
					/>
				</label>
				<label>
					<span>Password</span>
					<input
						type="password"
						value={form.password}
						onChange={(event) =>
							setForm({ ...form, password: event.target.value })
						}
						placeholder="Enter your password"
						required
					/>
				</label>
				{error ? <p className="form-error">{error}</p> : null}
				<button
					type="submit"
					className="primary-button full-width"
					disabled={submitting}
				>
					{submitting ? "Logging in..." : "Login"}
				</button>
				<p className="auth-helper">
					Default admin: <code>admin@planmaster.app</code> / <code>Admin123!</code>
				</p>
			</form>
		</AuthLayout>
	);
}

function RegisterPage({ onRegister }) {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const submit = async (event) => {
		event.preventDefault();
		setSubmitting(true);
		setError("");

		try {
			await registerUser(form);
			onRegister();
			navigate("/dashboard");
		} catch (registerError) {
			setError(registerError.message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<AuthLayout
			title="Create your account"
			subtitle="Start organizing plans with reminders, media, and progress tracking."
		>
			<form className="auth-form" onSubmit={submit}>
				<label>
					<span>Full name</span>
					<input
						type="text"
						value={form.name}
						onChange={(event) =>
							setForm({ ...form, name: event.target.value })
						}
						placeholder="Your full name"
						required
					/>
				</label>
				<label>
					<span>Email</span>
					<input
						type="email"
						value={form.email}
						onChange={(event) =>
							setForm({ ...form, email: event.target.value })
						}
						placeholder="you@example.com"
						required
					/>
				</label>
				<label>
					<span>Password</span>
					<input
						type="password"
						value={form.password}
						onChange={(event) =>
							setForm({ ...form, password: event.target.value })
						}
						placeholder="Choose a secure password"
						required
					/>
				</label>
				{error ? <p className="form-error">{error}</p> : null}
				<button
					type="submit"
					className="primary-button full-width"
					disabled={submitting}
				>
					{submitting ? "Creating account..." : "Register"}
				</button>
			</form>
		</AuthLayout>
	);
}

function DashboardPage({ session, onLogout }) {
	const navigate = useNavigate();
	const [snapshot, setSnapshot] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [form, setForm] = useState(emptyPlan);
	const [filter, setFilter] = useState("all");
	const [notice, setNotice] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const refresh = async () => {
		try {
			setLoading(true);
			setError("");
			setSnapshot(await getDashboardSnapshot());
		} catch (loadError) {
			setError(loadError.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refresh();
	}, [session.userId]);

	useReminderNotifications(snapshot?.upcoming ?? []);

	const visiblePlans = useMemo(() => {
		const plans = snapshot?.plans ?? [];
		if (filter === "completed") {
			return plans.filter((plan) => plan.status === "completed");
		}
		if (filter === "overdue") {
			return plans.filter((plan) => plan.derivedStatus === "overdue");
		}
		if (filter === "active") {
			return plans.filter((plan) => plan.derivedStatus === "active");
		}
		return plans;
	}, [filter, snapshot]);

	const startEdit = (plan) => {
		setEditingId(plan.id);
		setForm({
			title: plan.title,
			details: plan.details,
			category: plan.category,
			priority: plan.priority,
			dueDate: plan.dueDate ? plan.dueDate.slice(0, 16) : "",
			alarmAt: plan.alarmAt ? plan.alarmAt.slice(0, 16) : "",
			inputType: plan.inputType,
			textContent: plan.textContent ?? "",
			voiceUrl: plan.voiceUrl ?? "",
			videoUrl: plan.videoUrl ?? "",
		});
	};

	const resetForm = () => {
		setEditingId(null);
		setForm(emptyPlan);
	};

	const submitPlan = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");

		try {
			if (editingId) {
				await savePlan(editingId, form);
				setNotice("Plan updated successfully.");
			} else {
				await createPlan(form);
				setNotice("Plan created successfully.");
			}
			resetForm();
			await refresh();
		} catch (submitError) {
			setError(submitError.message);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (planId) => {
		try {
			await deletePlan(planId);
			setNotice("Plan deleted.");
			await refresh();
		} catch (deleteError) {
			setError(deleteError.message);
		}
	};

	const toggleComplete = async (plan) => {
		try {
			await savePlan(plan.id, {
				...plan,
				status: plan.status === "completed" ? "active" : "completed",
			});
			setNotice(
				plan.status === "completed"
					? "Plan moved back to active."
					: "Plan marked as completed.",
			);
			await refresh();
		} catch (toggleError) {
			setError(toggleError.message);
		}
	};

	const signOut = () => {
		logoutUser();
		onLogout();
		navigate("/login");
	};

	if (loading && !snapshot) {
		return <ScreenMessage title="Loading plans" body="Fetching your dashboard..." />;
	}

	if (!snapshot) {
		return (
			<ScreenMessage
				title="Could not load dashboard"
				body={error || "Please make sure the backend server is running."}
			/>
		);
	}

	return (
		<div className="app-shell">
			<header className="topbar">
				<div>
					<span className="eyebrow">User dashboard</span>
					<h1>{snapshot.user.name}&apos;s planning workspace</h1>
				</div>
				<div className="topbar-actions">
					<button
						type="button"
						className="secondary-button"
						onClick={() => setFilter("all")}
					>
						View all
					</button>
					<button type="button" className="ghost-button" onClick={signOut}>
						Logout
					</button>
				</div>
			</header>

			<section className="stats-grid">
				<StatCard label="Total plans" value={snapshot.summary.total.toString()} />
				<StatCard
					label="Completed"
					value={snapshot.summary.completed.toString()}
				/>
				<StatCard label="Overdue" value={snapshot.summary.overdue.toString()} />
				<StatCard label="Upcoming alarms" value={snapshot.upcoming.length.toString()} />
			</section>

			<div className="dashboard-layout">
				<div className="panel">
					<div className="panel-heading">
						<div>
							<span className="eyebrow">
								{editingId ? "Edit plan" : "Create a plan"}
							</span>
							<h2>{editingId ? "Update your plan" : "Add a new plan"}</h2>
						</div>
						{editingId ? (
							<button
								type="button"
								className="ghost-button"
								onClick={resetForm}
							>
								Cancel edit
							</button>
						) : null}
					</div>

					<form className="plan-form" onSubmit={submitPlan}>
						<label className="full-span">
							<span>Plan title</span>
							<input
								type="text"
								value={form.title}
								onChange={(event) =>
									setForm({ ...form, title: event.target.value })
								}
								placeholder="Example: Finish the client dashboard"
								required
							/>
						</label>
						<label className="full-span">
							<span>Description</span>
							<textarea
								rows="4"
								value={form.details}
								onChange={(event) =>
									setForm({ ...form, details: event.target.value })
								}
								placeholder="Add the details of what you need to do"
								required
							/>
						</label>
						<label>
							<span>Category</span>
							<select
								value={form.category}
								onChange={(event) =>
									setForm({ ...form, category: event.target.value })
								}
							>
								<option>Personal</option>
								<option>Work</option>
								<option>Learning</option>
								<option>Health</option>
							</select>
						</label>
						<label>
							<span>Priority</span>
							<select
								value={form.priority}
								onChange={(event) =>
									setForm({ ...form, priority: event.target.value })
								}
							>
								<option>Low</option>
								<option>Medium</option>
								<option>High</option>
							</select>
						</label>
						<label>
							<span>Due date</span>
							<input
								type="datetime-local"
								value={form.dueDate}
								onChange={(event) =>
									setForm({ ...form, dueDate: event.target.value })
								}
								required
							/>
						</label>
						<label>
							<span>Alarm time</span>
							<input
								type="datetime-local"
								value={form.alarmAt}
								onChange={(event) =>
									setForm({ ...form, alarmAt: event.target.value })
								}
							/>
						</label>
						<label className="full-span">
							<span>Plan input type</span>
							<div className="type-switcher">
								{["text", "voice", "video"].map((type) => (
									<button
										key={type}
										type="button"
										className={
											form.inputType === type
												? "switch-chip switch-chip-active"
												: "switch-chip"
										}
										onClick={() => setForm({ ...form, inputType: type })}
									>
										{type}
									</button>
								))}
							</div>
						</label>

						{form.inputType === "text" ? (
							<label className="full-span">
								<span>Text note</span>
								<textarea
									rows="3"
									value={form.textContent}
									onChange={(event) =>
										setForm({ ...form, textContent: event.target.value })
									}
									placeholder="Type the plan details or checklist here"
								/>
							</label>
						) : null}

						{form.inputType === "voice" ? (
							<label className="full-span">
								<span>Voice note URL</span>
								<input
									type="url"
									value={form.voiceUrl}
									onChange={(event) =>
										setForm({ ...form, voiceUrl: event.target.value })
									}
									placeholder="Paste a hosted voice note URL"
								/>
							</label>
						) : null}

						{form.inputType === "video" ? (
							<label className="full-span">
								<span>Video URL</span>
								<input
									type="url"
									value={form.videoUrl}
									onChange={(event) =>
										setForm({ ...form, videoUrl: event.target.value })
									}
									placeholder="Paste a video link"
								/>
							</label>
						) : null}

						<button
							type="submit"
							className="primary-button full-span"
							disabled={saving}
						>
							{saving
								? "Saving..."
								: editingId
									? "Save changes"
									: "Create plan"}
						</button>
					</form>
					{notice ? <p className="form-success">{notice}</p> : null}
					{error ? <p className="form-error">{error}</p> : null}
				</div>

				<div className="panel">
					<div className="panel-heading">
						<div>
							<span className="eyebrow">Plan activity</span>
							<h2>Track progress and outcomes</h2>
						</div>
						<div className="filter-row">
							{["all", "active", "completed", "overdue"].map((item) => (
								<button
									key={item}
									type="button"
									className={
										filter === item ? "filter-chip active" : "filter-chip"
									}
									onClick={() => setFilter(item)}
								>
									{item}
								</button>
							))}
						</div>
					</div>

					<div className="reminder-box">
						<h3>Upcoming reminders</h3>
						{snapshot.upcoming.length ? (
							snapshot.upcoming.slice(0, 3).map((plan) => (
								<div className="reminder-item" key={plan.id}>
									<strong>{plan.title}</strong>
									<span>{formatDate(plan.alarmAt)}</span>
								</div>
							))
						) : (
							<p className="muted-copy">No alarms are scheduled right now.</p>
						)}
					</div>

					<div className="plans-column">
						{visiblePlans.length ? (
							visiblePlans.map((plan) => (
								<PlanCard
									key={plan.id}
									plan={plan}
									onEdit={() => startEdit(plan)}
									onDelete={() => handleDelete(plan.id)}
									onToggleComplete={() => toggleComplete(plan)}
								/>
							))
						) : (
							<div className="empty-state">
								<p>No plans match this filter yet.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function AdminPage({ onLogout }) {
	const navigate = useNavigate();
	const [overview, setOverview] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const signOut = () => {
		logoutUser();
		onLogout();
		navigate("/login");
	};

	useEffect(() => {
		let active = true;
		getAdminOverview()
			.then((result) => {
				if (active) {
					setOverview(result);
				}
			})
			.catch((loadError) => {
				if (active) {
					setError(loadError.message);
				}
			})
			.finally(() => {
				if (active) {
					setLoading(false);
				}
			});

		return () => {
			active = false;
		};
	}, []);

	if (loading) {
		return <ScreenMessage title="Loading admin panel" body="Fetching platform activity..." />;
	}

	if (!overview) {
		return (
			<ScreenMessage
				title="Could not load admin panel"
				body={error || "Please make sure the backend server is running."}
			/>
		);
	}

	return (
		<div className="app-shell">
			<header className="topbar">
				<div>
					<span className="eyebrow">Admin panel</span>
					<h1>All users and plans</h1>
				</div>
				<button type="button" className="ghost-button" onClick={signOut}>
					Logout
				</button>
			</header>

			<section className="stats-grid">
				<StatCard label="Users" value={overview.summary.users.toString()} />
				<StatCard
					label="Total plans"
					value={overview.summary.totalPlans.toString()}
				/>
				<StatCard
					label="Completed plans"
					value={overview.summary.completed.toString()}
				/>
				<StatCard
					label="Overdue plans"
					value={overview.summary.overdue.toString()}
				/>
			</section>

			<section className="panel">
				<div className="panel-heading">
					<div>
						<span className="eyebrow">User plan table</span>
						<h2>Review activity across the platform</h2>
					</div>
				</div>
				<div className="user-table">
					<div className="table-head">
						<span>User</span>
						<span>Email</span>
						<span>Plans</span>
						<span>Completed</span>
						<span>Overdue</span>
					</div>
					{overview.users.map((user) => (
						<div className="table-row" key={user.id}>
							<span>{user.name}</span>
							<span>{user.email}</span>
							<span>{user.totalPlans}</span>
							<span>{user.completedPlans}</span>
							<span>{user.overduePlans}</span>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

function AuthLayout({ title, subtitle, children }) {
	return (
		<div className="app-shell auth-shell">
			<div className="auth-panel">
				<span className="eyebrow">PlanMaster</span>
				<h1>{title}</h1>
				<p>{subtitle}</p>
				{children}
			</div>
			<div className="auth-side">
				<div className="side-card">
					<h2>What this system supports</h2>
					<ul>
						<li>Secure login and registration flow</li>
						<li>User plans with due dates, alarms, and status</li>
						<li>Text, voice, and video-based plan input</li>
						<li>Admin visibility across all users</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

function StatCard({ label, value }) {
	return (
		<div className="stat-card">
			<span>{label}</span>
			<strong>{value}</strong>
		</div>
	);
}

function FeatureCard({ title, body }) {
	return (
		<div className="feature-card">
			<h3>{title}</h3>
			<p>{body}</p>
		</div>
	);
}

function ScreenMessage({ title, body }) {
	return (
		<div className="app-shell center-shell">
			<div className="panel message-panel">
				<h1>{title}</h1>
				<p>{body}</p>
			</div>
		</div>
	);
}

function PlanCard({ plan, onEdit, onDelete, onToggleComplete }) {
	return (
		<div className="plan-card">
			<div className="plan-card-head">
				<div>
					<div className="plan-meta">
						<span className={`status-pill status-${plan.derivedStatus}`}>
							{plan.derivedStatus}
						</span>
						<span className="tag-pill">{plan.priority}</span>
						<span className="tag-pill">{plan.category}</span>
						<span className="tag-pill">{plan.inputType}</span>
					</div>
					<h3>{plan.title}</h3>
				</div>
				<div className="plan-actions">
					<button type="button" className="ghost-button" onClick={onEdit}>
						Edit
					</button>
					<button type="button" className="ghost-button" onClick={onDelete}>
						Delete
					</button>
				</div>
			</div>

			<p>{plan.details}</p>
			<div className="plan-dates">
				<span>Due: {formatDate(plan.dueDate)}</span>
				<span>Alarm: {plan.alarmAt ? formatDate(plan.alarmAt) : "Not set"}</span>
				<span>Updated: {formatDate(plan.updatedAt)}</span>
			</div>
			{plan.inputType === "text" && plan.textContent ? (
				<div className="media-box">{plan.textContent}</div>
			) : null}
			{plan.inputType === "voice" && plan.voiceUrl ? (
				<a
					className="media-link"
					href={plan.voiceUrl}
					target="_blank"
					rel="noreferrer"
				>
					Open voice note
				</a>
			) : null}
			{plan.inputType === "video" && plan.videoUrl ? (
				<a
					className="media-link"
					href={plan.videoUrl}
					target="_blank"
					rel="noreferrer"
				>
					Open video
				</a>
			) : null}
			<button
				type="button"
				className="primary-button soft-button"
				onClick={onToggleComplete}
			>
				{plan.status === "completed" ? "Move to active" : "Mark complete"}
			</button>
		</div>
	);
}

function useReminderNotifications(plans) {
	useEffect(() => {
		if (!("Notification" in window) || Notification.permission === "denied") {
			return undefined;
		}

		if (Notification.permission !== "granted") {
			Notification.requestPermission();
			return undefined;
		}

		const timers = plans
			.filter((plan) => plan.alarmAt)
			.map((plan) => {
				const delay = new Date(plan.alarmAt).getTime() - Date.now();
				if (delay <= 0 || delay > 86400000) {
					return null;
				}

				return window.setTimeout(() => {
					new Notification(`Plan reminder: ${plan.title}`, {
						body: plan.details,
					});
				}, delay);
			})
			.filter(Boolean);

		return () => {
			timers.forEach((timer) => window.clearTimeout(timer));
		};
	}, [plans]);
}

function formatDate(value) {
	if (!value) {
		return "Not available";
	}

	return new Date(value).toLocaleString();
}

export default App;
