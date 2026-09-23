import { type Booking } from "../schemas/booking.schema.ts";
import {
  BookingRepository,
  type CreateBookingInput,
  type UpdateBookingInput,
} from "../repositories/booking.repository.ts";

type StoredBooking = Booking & { id: string };

export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository = new BookingRepository()) {}

  findAll(): StoredBooking[] {
    return this.bookingRepository.findAll();
  }

  findById(id: string): StoredBooking | undefined {
    return this.bookingRepository.findById(id);
  }

  create(booking: CreateBookingInput): StoredBooking {
    if (booking.desk.trim().length < 3) {
      throw new Error("Desk name must be at least 3 characters long");
    }

    const created = this.bookingRepository.create(booking);
    return created;
  }

  update(id: string, data: UpdateBookingInput): StoredBooking | undefined {
    return this.bookingRepository.update(id, data);
  }

  delete(id: string): boolean {
    return this.bookingRepository.delete(id);
  }
}
