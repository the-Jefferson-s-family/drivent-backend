import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingRoom, listBooking, changeBooking, bookingsByRoomId, listAllBookings, bookingUser } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("", listBooking)
  .get("/all/:hotelId", listAllBookings)
  .get("/user", bookingUser)
  .post("", bookingRoom)
  .put("/:bookingId", changeBooking)
  .get("/:roomId", bookingsByRoomId);

export { bookingRouter };
