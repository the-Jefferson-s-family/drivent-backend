import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingRoom, listBooking, changeBooking, listAllBookings, bookingUser, bookingsByRoomId  } from "@/controllers";

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
