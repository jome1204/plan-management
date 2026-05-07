import { User } from "../models/User.js";
import { signToken } from "../utils/token.js";

function serializeUser(user) {
	return {
		id: user._id,
		name: user.name,
		email: user.email,
		role: user.role,
	};
}

export async function register(request, response) {
	const { name, email, password } = request.body;

	const exists = await User.findOne({ email });
	if (exists) {
		return response.status(409).json({ message: "Email already in use." });
	}

	const user = await User.create({ name, email, password });
	const token = signToken(user);

	return response.status(201).json({
		token,
		user: serializeUser(user),
	});
}

export async function login(request, response) {
	const { email, password } = request.body;
	const user = await User.findOne({ email });

	if (!user || !(await user.comparePassword(password))) {
		return response.status(401).json({ message: "Invalid credentials." });
	}

	const token = signToken(user);
	return response.json({
		token,
		user: serializeUser(user),
	});
}

export async function me(request, response) {
	return response.json({ user: serializeUser(request.user) });
}
