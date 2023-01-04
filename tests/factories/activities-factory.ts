import  faker from "@faker-js/faker";
import { prisma } from "@/config";
import dayjs from "dayjs";

export function createActivities(startTime: number, finishTime: number) {
  return prisma.activities.create({
    data: {
      title: faker.lorem.sentence(),
      vacancies: Number(faker.random.numeric()),
      local: faker.lorem.sentence(),
      date: dayjs().add(1, "day").hour(0).minute(0).second(0).millisecond(0).toDate(),
      startTime: dayjs().add(1, "day").hour(startTime).minute(0).second(0).millisecond(0).toDate(),
      finishTime: dayjs().add(1, "day").hour(finishTime).minute(0).second(0).millisecond(0).toDate()
    },
  });
}

export function createActivitiesAdd2days(startTime: number, finishTime: number) {
  return prisma.activities.create({
    data: {
      title: faker.lorem.sentence(),
      vacancies: Number(faker.random.numeric()),
      local: faker.lorem.sentence(),
      date: dayjs().add(2, "day").hour(0).minute(0).second(0).millisecond(0).toDate(),
      startTime: dayjs().hour(startTime).minute(0).second(0).millisecond(0).toDate(),
      finishTime: dayjs().hour(finishTime).minute(0).second(0).millisecond(0).toDate()
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
