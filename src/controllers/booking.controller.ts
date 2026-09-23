import type { Request, Response } from "express";
import { BookingService } from "../services/booking.service.ts";

export class BookingController {
  constructor(private readonly bookingService: BookingService = new BookingService()) {}

  findAll = (req: Request, res: Response): void => {
    const bookings = this.bookingService.findAll();
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
    console.log(`[controller] BookingController.create called with body:`, req.body);
    try {
      const booking = this.bookingService.create(req.body);
      console.log(`[controller] BookingController.create responding 201 with created booking`);
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

      if (!booking) {
        res.status(404).json({ status: "fail", message: "Booking not found", errors: [] });
        return;
      }

      res.status(200).json(booking);
    } catch (error) {
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

    const deleted = this.bookingService.delete(id);

    if (!deleted) {
      res.status(404).json({ status: "fail", message: "Booking not found", errors: [] });
      return;
    }

    res.status(204).send();
  };
}
