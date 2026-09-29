import { z } from "zod";

export const createBookingSchema = z.object({
  desk: z.string().trim().min(3).max(100),
  floor: z.string().trim().min(5).max(200),
  date: z.iso.date(),
  active: z.boolean().optional().default(true),
});

export type Booking = z.infer<typeof createBookingSchema>;