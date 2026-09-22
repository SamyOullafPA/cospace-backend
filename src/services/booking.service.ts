import {
  BookingRepository,
  Booking,
  CreateBookingInput,
  UpdateBookingInput,
} from "../repositories/booking.repository.ts";

export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository = new BookingRepository()) {}

  findAll(): Booking[] {
    return this.bookingRepository.findAll();
  }

  findById(id: string): Booking | undefined {
    return this.bookingRepository.findById(id);
  }

  create(booking: CreateBookingInput): Booking {
    if (booking.desk.trim().length < 3) {
      throw new Error("Desk name must be at least 3 characters long");
    }

    return this.bookingRepository.create(booking);
  }

  update(id: string, data: UpdateBookingInput): Booking | undefined {
    return this.bookingRepository.update(id, data);
  }

  delete(id: string): boolean {
    return this.bookingRepository.delete(id);
  }
}
