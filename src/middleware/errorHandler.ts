import { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (error, _req, res, _next): void => {
	if (error instanceof ZodError) {
		res.status(400).json({
			status: "fail",
			message: "Validation failed",
			errors: error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			})),
		});
		return;
	}

	console.error(error instanceof Error ? error.stack : error);

	res.status(500).json({
		status: "fail",
		message: "Internal Server Error",
		errors: [],
	});
};

export default errorHandler;
