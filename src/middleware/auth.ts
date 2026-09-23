import { type NextFunction, type Request, type Response } from "express";

const EXPECTED_TOKEN = "super-secret-key";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
	const authorization = req.headers.authorization;
	const token = authorization?.startsWith("Bearer ")
		? authorization.slice("Bearer ".length)
		: authorization;

	if (token !== EXPECTED_TOKEN) {
		res.status(401).json({
			status: "fail",
			message: "Unauthorized",
			errors: [],
		});
		return;
	}

	next();
};

export default authMiddleware;
