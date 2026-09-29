import { type Booking } from "../schemas/booking.schema.ts";
import {
  BookingRepository,
  type CreateBookingInput,
  type UpdateBookingInput,
} from "../repositories/booking.repository.ts";

type StoredBooking = Booking & { id: string };

export class BookingNotFoundError extends Error {
  constructor(public readonly id: string) {
    super("Booking not found");
    this.name = "BookingNotFoundError";
  }
}

type PaginatedBookings = {
  data: StoredBooking[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
};

export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository = new BookingRepository()) {}

  findAll(): StoredBooking[] {
    return this.bookingRepository.findAll();
  }

  getPaginatedShifts(page: number = 1, limit: number = 10): PaginatedBookings {
    const itemsPerPage = Math.min(Math.max(Math.trunc(limit), 1), 50);
    const totalItems = this.bookingRepository.count();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const currentPage = Math.min(Math.max(Math.trunc(page), 1), Math.max(totalPages, 1));
    const skip = (currentPage - 1) * itemsPerPage;

    return {
      data: this.bookingRepository.findPaginated(skip, itemsPerPage),
      meta: { totalItems, itemsPerPage, currentPage, totalPages },
    };
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

  update(id: string, data: UpdateBookingInput): StoredBooking {
    const updated = this.bookingRepository.update(id, data);
    if (!updated) {
      throw new BookingNotFoundError(id);
    }

    return updated;
  }

  delete(id: string): void {
    const deleted = this.bookingRepository.delete(id);
    if (!deleted) {
      throw new BookingNotFoundError(id);
    }
  }

  populateFakeData(): StoredBooking[] {
    return this.bookingRepository.populateFakeData();
  }
}
