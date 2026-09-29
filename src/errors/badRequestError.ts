import { AppError } from "../utils/appError.ts";
import { HttpStatus } from "../constants/httpStatus.ts";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, HttpStatus.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
