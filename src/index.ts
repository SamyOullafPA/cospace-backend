import express, { Request, Response } from "express";
import BookingRouter from "./routes/booking.routes.ts";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "active", message: "CoSpace API is running" });
});

app.use("/bookings", BookingRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on("SIGTERM", () => {
  process.exit(0);
});

process.on("SIGINT", () => {
  process.exit(0);
});

export default app;