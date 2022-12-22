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

async function findByActivitiesId(actId: number) {
  return prisma.activities.findMany({
    where: {
      id: actId,
    },
  });
}

async function findActivitiesByStartTime(actId: number) {
  return prisma.activities.findMany({
    where: {
      id: actId,
    },
  });
}

// async function findByUserId(userId: number) {
//   return prisma.activities.findFirst({
//     where: {
//       userId,
//     },
//     include: {
//       Room: true,
//     }
//   });
// }

const activitiesRepository = {
  findAllActivities,
  findByActivitiesId
};

export default activitiesRepository;
