import { prisma } from "@/config";

async function findAllActivities(date: Date) {
  return prisma.activities.findMany({
    where: {
      date: date
    }
  });
}
const activitiesRepository = {
  findAllActivities,
};

export default activitiesRepository;
