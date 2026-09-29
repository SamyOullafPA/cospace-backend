import { AppError } from "../utils/appError.ts";
import { HttpStatus } from "../constants/httpStatus.ts";

export class ForbiddenError extends AppError {
  constructor(message: string = "You are not allowed to do that") {
    super(message, HttpStatus.FORBIDDEN);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
