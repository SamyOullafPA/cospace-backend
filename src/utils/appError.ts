import { HttpStatus } from "../constants/httpStatus.ts";

export class AppError extends Error {
  public readonly status: "fail" | "error";
  public readonly isOperational = true;

  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);

    this.status =
      statusCode >= HttpStatus.BAD_REQUEST && statusCode < HttpStatus.INTERNAL_SERVER_ERROR
        ? "fail"
        : "error";

    // Keeps this constructor out of the reported stack.
    Error.captureStackTrace(this, this.constructor);

    // Restores the subclass prototype, which extending a built-in loses when targeting ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
