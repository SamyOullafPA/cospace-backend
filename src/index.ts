import express, { Request, Response } from "express";
import cors from "cors";
import BookingRouter from "./routes/booking.routes.ts";
import LoggerFunction from "./middleware/logger.ts";
import errorHandler from "./middleware/errorHandler.ts";
import notFoundError = require("./errors/notFoundError.ts");

const app = express();
const PORT = 5000;

app.use(LoggerFunction);
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "active", message: "CoSpace API is running" });
});

// Route to trigger a test NotFoundError
app.get("/boom-app-error", () => {
  throw new notFoundError.NotFoundError("Test resource not found");
});
 
// Temporary: trigger a plain, unexpected error to verify sanitized 500 response
app.get("/boom-unexpected", () => {
  throw new Error("db connection string: postgres://user:pass@internal-host/db");
});

app.get('/generic-error', () => {
  throw new Error("Database server exploded");
})

app.use("/bookings", BookingRouter);

app.use(errorHandler);

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