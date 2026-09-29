import { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError.ts";
import { HttpStatus } from "../constants/httpStatus.ts";

const errorHandler: ErrorRequestHandler = (error, req, res, _next): void => {
	if (error instanceof ZodError) {
		res.status(HttpStatus.BAD_REQUEST).json({
			status: "fail",
			message: "Validation failed",
			errors: error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			})),
		});
		return;
	}

	if (error instanceof AppError && error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
			errors: [],
		});
		return;
	}

	console.error(
		JSON.stringify({
			timestamp: new Date().toISOString(),
			level: "error",
			route: `${req.method} ${req.originalUrl}`,
			requestId: req.headers["x-request-id"] ?? null,
			name: error instanceof Error ? error.name : "UnknownError",
			message: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		}),
	);

	res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
		status: "error",
		message: "Something went wrong on our end",
		errors: [],
	});
};

export default errorHandler;
