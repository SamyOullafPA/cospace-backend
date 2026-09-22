export interface Booking {
  id: string;
  desk: string;
  floor: string;
  date: string;
  active: boolean;
}

export type CreateBookingInput = Omit<Booking, "id" | "active"> & {
  active?: boolean;
};

export type UpdateBookingInput = Partial<Omit<Booking, "id">>;

export class BookingRepository {
  private bookings: Booking[] = [];

  findAll(): Booking[] {
    return this.bookings;
  }

  findById(id: string): Booking | undefined {
    return this.bookings.find((booking) => booking.id === id);
  }

  create(booking: CreateBookingInput): Booking {
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      active: true,
      ...booking,
    };

    this.bookings.push(newBooking);
    return newBooking;
  }

  update(id: string, data: UpdateBookingInput): Booking | undefined {
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
}
