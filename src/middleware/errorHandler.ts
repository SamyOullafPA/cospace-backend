import { type ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, _req, res, _next): void => {
	console.error(error instanceof Error ? error.stack : error);

	res.status(500).json({
		status: "fail",
		message: "Internal Server Error",
		errors: [],
	});
};

export default errorHandler;
