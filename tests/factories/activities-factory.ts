import  faker from "@faker-js/faker";
import { prisma } from "@/config";
import dayjs from "dayjs";

export function createActivities() {
  return prisma.activities.create({
    data: {
      title: faker.lorem.sentence(),
      vacancies: Number(faker.random.numeric()),
      local: faker.lorem.sentence(),
      date: dayjs().add(1, "day").hour(0).minute(0).second(0).millisecond(0).toDate(),
      startTime: dayjs().add(1, "day").hour(9).minute(0).second(0).millisecond(0).toDate(),
      finishTime: dayjs().add(1, "day").hour(11).minute(0).second(0).millisecond(0).toDate()
    },
  });
}
