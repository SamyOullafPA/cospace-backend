import { Router } from "express";
import { BookingController } from "../controllers/booking.controller.ts";
import authMiddleware from "../middleware/auth.ts";
import validateSchema from "../middleware/validate.ts";
import { createBookingSchema } from "../schemas/booking.schema.ts";

const router = Router();
const bookingController = new BookingController();

router.get("/", bookingController.findAll);
router.get("/:id", bookingController.findById);
router.post(
	"/",
	authMiddleware,
	validateSchema(createBookingSchema),
	bookingController.create,
);
router.put("/:id", bookingController.update);
router.patch("/:id", bookingController.update);
router.delete("/:id", bookingController.delete);

export default router;