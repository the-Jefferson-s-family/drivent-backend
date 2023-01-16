import { AuthenticatedRequest } from "@/middlewares";
import e, { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function listBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send({
      id: booking.id,
      Room: booking.Room,
    });
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function bookingRoom(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const { roomId } = req.body;

    if (!roomId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const booking = await bookingService.bookingRoomById(userId, Number(roomId));

    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    if (error.name === "CannotBookingError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function bookingsByRoomId(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { roomId } = req.params;

    if (!roomId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const booking = await bookingService.bookingsByRoomId(userId, Number(roomId));

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "CannotBookingError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const bookingId = Number(req.params.bookingId);

    if (!bookingId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const { roomId } = req.body;

    if (!roomId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const booking = await bookingService.changeBookingRoomById(userId, Number(roomId));

    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    if (error.name === "CannotBookingError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function listAllBookings(req: AuthenticatedRequest, res: Response) {
  try {
    const { hotelId } = req.params;
    
    const validHotel = await bookingService.findHotelById(Number(hotelId));
    if(!validHotel) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const hotelRooms = await bookingService.getRoomsByIdHotel(Number(hotelId));

    const bookings = hotelRooms.map((e) => {
      let full = false;
      if(e.capacity === e.Booking.length) {
        full = !full;
      }
      return ({
        id: e.id,
        name: e.name,
        occupied: e.Booking.length,
        free: -(e.Booking.length -e.capacity),
        full
      });
    });

    return res.status(httpStatus.OK).send(bookings);
  } catch (error) {
    if (error.name === "CannotBookingError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function bookingUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const bookingsUser = await bookingService.findBookingsUser(userId);
    console.log(bookingsUser);
    const bookingFilter = bookingsUser.map((booking) => {
      let type;
      if(booking.Room.capacity === 1) {
        type = "Single";
      }else if(booking.Room.capacity === 2) {
        type = "Duble";
      }else if(booking.Room.capacity === 3) {
        type = "Triple";
      }else{
        type = "Group";
      }
      return {
        bookingId: booking.id,
        roomId: booking.roomId,
        roomName: booking.Room.name,
        roomType: type,
        roomCapacity: booking.Room.capacity,
        roomBooking: booking.Room.Booking.length,
        hotelId: booking.Room.hotelId,
        hotelName: booking.Room.Hotel.name,
        hotelImage: booking.Room.Hotel.image
      };
    });

    return res.status(httpStatus.OK).send(bookingFilter);
  } catch (error) {
    if (error.name === "CannotBookingError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
