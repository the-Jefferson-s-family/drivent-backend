import { prisma } from "@/config";
import { Booking } from "@prisma/client";

type CreateParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;
type UpdateParams = Omit<Booking, "createdAt" | "updatedAt">;

async function create({ roomId, userId }: CreateParams): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    }
  });
}

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    }
  });
}

async function findByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    }
  });
}

async function upsertBooking({ id, roomId, userId }: UpdateParams) {
  return prisma.booking.upsert({
    where: {
      id,
    },
    create: {
      roomId,
      userId,
    },
    update: {
      roomId,
    }
  });
}

async function checkValidHotel(id: number) {
  return prisma.hotel.findUnique({ where: { id } });
}

async function getRooms(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId
    },
    include: {
      Booking: true
    }
  });
}

async function findBookingsRoom() {
  return prisma.booking.findMany();
}

async function findAllBookingsUser(userId: number) {
  return prisma.booking.findMany({
    where: {
      userId
    },
    include: {
      Room: {
        include: {
          Hotel: true,
          Booking: true,
        }
      }
    },
  });
}

const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
  findBookingsRoom,
  checkValidHotel,
  getRooms,
  findAllBookingsUser
};

export default bookingRepository;
