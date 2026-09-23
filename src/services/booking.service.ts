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
    console.log(`[service] BookingService.create validating desk name length`);
    if (booking.desk.trim().length < 3) {
      throw new Error("Desk name must be at least 3 characters long");
    }

    const created = this.bookingRepository.create(booking);
    console.log(`[service] BookingService.create returning booking to controller`);
    return created;
  }

  update(id: string, data: UpdateBookingInput): Booking | undefined {
    return this.bookingRepository.update(id, data);
  }

  delete(id: string): boolean {
    return this.bookingRepository.delete(id);
  }
}
