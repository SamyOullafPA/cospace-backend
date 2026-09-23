import { type NextFunction, type Request, type Response } from "express";

const LoggerFunction = (req: Request, res: Response, next: NextFunction): void => {
    console.log({
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString(),
    });

    next();
};

export default LoggerFunction;