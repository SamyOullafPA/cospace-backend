import type { Request, Response } from "express";
import { BookingService, BookingNotFoundError } from "../services/booking.service.ts";

const MAX_LIMIT = 50;

export class BookingController {
  constructor(private readonly bookingService: BookingService = new BookingService()) {}

  findAll = (req: Request, res: Response): void => {
    const requestedPage = Number(req.query.page ?? 1);
    const requestedLimit = Number(req.query.limit ?? 10);

    if (!Number.isFinite(requestedPage) || !Number.isFinite(requestedLimit)) {
      res.status(400).json({
        status: "fail",
        message: "page and limit must be numbers",
        errors: [],
      });
      return;
    }

    const safePage = Math.max(Math.trunc(requestedPage), 1);
    const safeLimit = Math.min(Math.max(Math.trunc(requestedLimit), 1), MAX_LIMIT);

    const bookings = this.bookingService.getPaginatedShifts(safePage, safeLimit);
    res.status(200).json(bookings);
  };

  findById = (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ status: "fail", message: "Booking id is required", errors: [] });
      return;
    }

    const booking = this.bookingService.findById(id);

    if (!booking) {
      res.status(404).json({ status: "fail", message: "Booking not found", errors: [] });
      return;
    }

    res.status(200).json(booking);
  };

  create = (req: Request, res: Response): void => {
    try {
      const booking = this.bookingService.create(req.body);
      res.status(201).json(booking);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create booking";
      res.status(400).json({ status: "fail", message, errors: [] });
    }
  };

  update = (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ status: "fail", message: "Booking id is required", errors: [] });
      return;
    }

    try {
      const booking = this.bookingService.update(id, req.body);
      res.status(200).json(booking);
    } catch (error) {
      if (error instanceof BookingNotFoundError) {
        res.status(404).json({ status: "fail", message: error.message, errors: [] });
        return;
      }

      const message = error instanceof Error ? error.message : "Unable to update booking";
      res.status(400).json({ status: "fail", message, errors: [] });
    }
  };

  delete = (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ status: "fail", message: "Booking id is required", errors: [] });
      return;
    }

    try {
      this.bookingService.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof BookingNotFoundError) {
        res.status(404).json({ status: "fail", message: error.message, errors: [] });
        return;
      }

      const message = error instanceof Error ? error.message : "Unable to delete booking";
      res.status(400).json({ status: "fail", message, errors: [] });
    }
  };

  populateFakeData = (req: Request<{ id : string}>, res: Response): void => {
    try {
      const bookings = this.bookingService.populateFakeData();
      res.status(201).json(bookings);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create booking";
      res.status(400).json({ status: "fail", message, errors: [] });
    }
  }
}
