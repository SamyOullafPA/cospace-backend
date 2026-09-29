import { AppError } from "../utils/appError.ts";
import { HttpStatus } from "../constants/httpStatus.ts";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Not signed in") {
    super(message, HttpStatus.UNAUTHORIZED);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
