import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingRoom, changeBooking, bookingsByRoomId, bookingOfUser } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", bookingOfUser)
  .post("/", bookingRoom)
  .put("/:bookingId", changeBooking)
  .get("/:roomId", bookingsByRoomId);

export { bookingRouter };
