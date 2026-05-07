export function notFoundHandler(request, response) {
	return response.status(404).json({ message: "Route not found." });
}

export function errorHandler(error, request, response, next) {
	console.error(error);
	return response.status(500).json({
		message: error.message || "Internal server error.",
	});
}
