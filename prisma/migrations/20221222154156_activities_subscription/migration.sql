/*
  Warnings:

  - You are about to drop the `ActivitiesSubscrition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivitiesSubscrition" DROP CONSTRAINT "ActivitiesSubscrition_activitiesId_fkey";

-- DropForeignKey
ALTER TABLE "ActivitiesSubscrition" DROP CONSTRAINT "ActivitiesSubscrition_userId_fkey";

-- DropTable
DROP TABLE "ActivitiesSubscrition";

-- CreateTable
CREATE TABLE "ActivitiesSubscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activitiesId" INTEGER NOT NULL,

    CONSTRAINT "ActivitiesSubscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivitiesSubscription" ADD CONSTRAINT "ActivitiesSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitiesSubscription" ADD CONSTRAINT "ActivitiesSubscription_activitiesId_fkey" FOREIGN KEY ("activitiesId") REFERENCES "Activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
