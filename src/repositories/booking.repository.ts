import { createBookingSchema, type Booking } from "../schemas/booking.schema.ts";
import { type input } from "zod";

type StoredBooking = Booking & { id: string };
export type CreateBookingInput = input<typeof createBookingSchema>;
export type UpdateBookingInput = Partial<Booking>;

export class BookingRepository {
  private bookings: StoredBooking[] = [];

  findAll(): StoredBooking[] {
    return this.bookings;
  }

  findById(id: string): StoredBooking | undefined {
    return this.bookings.find((booking) => booking.id === id);
  }

  create(booking: CreateBookingInput): StoredBooking {
    const newBooking: StoredBooking = {
      id: crypto.randomUUID(),
      active: true,
      ...booking,
    };

    this.bookings.push(newBooking);
    return newBooking;
  }

  update(id: string, data: UpdateBookingInput): StoredBooking | undefined {
    const booking = this.findById(id);
    if (!booking) {
      return undefined;
    }

    Object.assign(booking, data);
    return booking;
  }

  delete(id: string): boolean {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1) {
      return false;
    }

    this.bookings.splice(index, 1);
    return true;
  }

  // Function designed to fake data for dev purposes.
  populateFakeData(): StoredBooking[] {
    if (this.bookings.length === 0)
    {
      const newBooking1: StoredBooking = {
        id: crypto.randomUUID(),
        active: true,
        desk: "Desk F3",
        floor: "6",
        date: "2026-09-29"
      };

      const newBooking2: StoredBooking = {
        id: crypto.randomUUID(),
        active: true,
        desk: "Desk D1",
        floor: "6",
        date: "2026-09-29"
      };

      const newBooking3: StoredBooking = {
        id: crypto.randomUUID(),
        active: true,
        desk: "Desk G2",
        floor: "7",
        date: "2026-09-30"
      };

      this.bookings.push(newBooking1, newBooking2, newBooking3);

      return this.bookings;
    }
    
    return []
  }
}