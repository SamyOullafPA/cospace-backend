import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

interface Booking {
  id: string;
  desk: string;
  floor: string;
  date: string;
  active: boolean;
}

const bookings: Booking[] = [
  { id: "1", desk: "Desk A1", floor: "Floor 2, North Wing", date: "2026-09-22", active: true },
  { id: "2", desk: "Desk B3", floor: "Floor 1, South Wing", date: "2026-09-23", active: true },
  { id: "3", desk: "Desk C2", floor: "Floor 3, East Wing", date: "2026-09-24", active: false },
];

router.get("/", (req: Request, res: Response) => {
  res.status(200).json(bookings);
});

router.get("/:id", (req: Request, res: Response) => {
  const booking = bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ status: "fail", message: "Booking not found", errors: [] });
    return;
  }

  res.status(200).json(booking);
});

router.post("/", (req: Request, res: Response) => {
  const { id, desk, floor, date, active } = req.body as Booking;
  const newBooking: Booking = { id, desk, floor, date, active };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

router.put("/:id", (req: Request, res: Response) => {
  const index = bookings.findIndex((b) => b.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ status: "fail", message: "Booking not found", errors: [] });
    return;
  }

  const { desk, floor, date, active } = req.body as Booking;
  const updatedBooking: Booking = { id: String(req.params.id), desk, floor, date, active };
  bookings[index] = updatedBooking;

  res.status(200).json(updatedBooking);
});

router.patch("/:id", (req: Request, res: Response) => {
  const booking = bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ status: "fail", message: "Booking not found", errors: [] });
    return;
  }

  booking.active = !booking.active;
  res.status(200).json(booking);
});

router.delete("/:id", (req: Request, res: Response) => {
  const index = bookings.findIndex((b) => b.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ status: "fail", message: "Booking not found", errors: [] });
    return;
  }

  bookings.splice(index, 1);
  res.status(204).send();
});

export default router;