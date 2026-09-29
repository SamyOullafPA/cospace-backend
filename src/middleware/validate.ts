import { type NextFunction, type Request, type Response } from "express";
import { ZodError, type ZodSchema } from "zod";

const validateSchema = (schema: ZodSchema) =>
	(req: Request, res: Response, next: NextFunction): void => {
		try {
			const parsedData = schema.parse(req.body);
			req.body = parsedData;
			next();
		} catch (error) {
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

			next(error);
		}
	};

export default validateSchema;
