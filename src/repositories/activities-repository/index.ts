import { prisma } from "@/config";

async function findAllActivities(date: Date) {
  return prisma.activities.findMany({
    where: {
      date: date
    },
    include: {
      ActivitiesSubscription: true
    }
  });
}

async function findActivitiesById(actId: number) {
  return prisma.activities.findFirst({
    where: {
      id: actId,
    },
  });
}

async function creatActivitiesWithUser(userId: number, activitiesId: number) {
  return prisma.activitiesSubscription.create({
    data: {
      userId,
      activitiesId,
    },
  });
}

async function findUserActivities(userId: number) {
  return prisma.activitiesSubscription.findMany({
    where: {
      userId
    }
  });
}

const activitiesRepository = {
  findAllActivities,
  findActivitiesById,
  creatActivitiesWithUser,
  findUserActivities
};

export default activitiesRepository;
