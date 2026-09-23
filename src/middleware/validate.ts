import { type NextFunction, type Request, type Response } from "express";

const validateRequiredFields = (requiredFields: string[]) =>
	(req: Request, res: Response, next: NextFunction): void => {
		const missingFields = requiredFields.filter(
			(field) => req.body?.[field] === undefined || req.body[field] === null,
		);

		if (missingFields.length > 0) {
			res.status(400).json({
				status: "fail",
				message: "Missing required fields",
				errors: missingFields,
			});
			return;
		}

		next();
	};

export default validateRequiredFields;
