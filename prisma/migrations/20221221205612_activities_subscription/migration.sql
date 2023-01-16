-- CreateTable
CREATE TABLE "ActivitiesSubscrition" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activitiesId" INTEGER NOT NULL,

    CONSTRAINT "ActivitiesSubscrition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivitiesSubscrition" ADD CONSTRAINT "ActivitiesSubscrition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitiesSubscrition" ADD CONSTRAINT "ActivitiesSubscrition_activitiesId_fkey" FOREIGN KEY ("activitiesId") REFERENCES "Activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
