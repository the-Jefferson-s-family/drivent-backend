import  faker from "@faker-js/faker";
import { prisma } from "@/config";
import dayjs from "dayjs";

export function createActivities() {
  const today = dayjs().add(1, "day");
  return prisma.activities.create({
    data: {
      title: faker.lorem.sentence(),
      vacancies: Number(faker.random.numeric()),
      local: faker.lorem.sentence(),
      date: today.hour(0).minute(0).second(0).millisecond(0).toDate(),
      startTime: today.hour(9).minute(0).second(0).millisecond(0).toDate(),
      finishTime: today.hour(11).minute(0).second(0).millisecond(0).toDate()
    },
  });
}

export function createActivitiesSubscription( userId: number, activitiesId: number ) {
  return prisma.activitiesSubscription.create({
    data: {
      userId,
      activitiesId
    }
  });
}
