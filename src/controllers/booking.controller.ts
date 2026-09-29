import type { NextFunction, Request, Response } from "express";
import { BookingService } from "../services/booking.service.ts";
import { BadRequestError } from "../errors/badRequestError.ts";
import { NotFoundError } from "../errors/notFoundError.ts";
import { HttpStatus } from "../constants/httpStatus.ts";

const MAX_LIMIT = 50;

export class BookingController {
  constructor(private readonly bookingService: BookingService = new BookingService()) {}

  findAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const requestedPage = Number(req.query.page ?? 1);
      const requestedLimit = Number(req.query.limit ?? 10);

      if (!Number.isFinite(requestedPage) || !Number.isFinite(requestedLimit)) {
        throw new BadRequestError("page and limit must be numbers");
      }

      const safePage = Math.max(Math.trunc(requestedPage), 1);
      const safeLimit = Math.min(Math.max(Math.trunc(requestedLimit), 1), MAX_LIMIT);

      const bookings = this.bookingService.getPaginatedShifts(safePage, safeLimit);
      res.status(HttpStatus.OK).json(bookings);
    } catch (error) {
      next(error);
    }
  };

  findById = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Booking id is required");
      }

      const booking = this.bookingService.findById(id);
      if (!booking) {
        throw new NotFoundError("Booking not found");
      }

      res.status(HttpStatus.OK).json(booking);
    } catch (error) {
      next(error);
    }
  };

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const booking = this.bookingService.create(req.body);
      res.status(HttpStatus.CREATED).json(booking);
    } catch (error) {
      next(error);
    }
  };

  update = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Booking id is required");
      }

      const booking = this.bookingService.update(id, req.body);
      res.status(HttpStatus.OK).json(booking);
    } catch (error) {
      next(error);
    }
  };

  delete = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Booking id is required");
      }

      this.bookingService.delete(id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  populateFakeData = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const bookings = this.bookingService.populateFakeData();
      res.status(HttpStatus.CREATED).json(bookings);
    } catch (error) {
      next(error);
    }
  };
}
