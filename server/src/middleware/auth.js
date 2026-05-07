import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User } from "../models/User.js";

export async function requireAuth(request, response, next) {
	const header = request.headers.authorization;

	if (!header?.startsWith("Bearer ")) {
		return response.status(401).json({ message: "Authentication required." });
	}

	try {
		const token = header.slice(7);
		const payload = jwt.verify(token, env.jwtSecret);
		const user = await User.findById(payload.sub);

		if (!user) {
			return response.status(401).json({ message: "User no longer exists." });
		}

		request.user = user;
		return next();
	} catch (error) {
		return response.status(401).json({ message: "Invalid token." });
	}
}

export function requireRole(role) {
	return (request, response, next) => {
		if (request.user.role !== role) {
			return response.status(403).json({ message: "Access denied." });
		}

		return next();
	};
}
