import { AppError } from "../utils/appError.ts";
import { HttpStatus } from "../constants/httpStatus.ts";

export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(message, HttpStatus.NOT_FOUND);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
