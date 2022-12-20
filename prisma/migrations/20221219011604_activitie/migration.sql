-- CreateTable
CREATE TABLE "Activities" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "vacancies" INTEGER NOT NULL,
    "local" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "finishTime" TEXT NOT NULL,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);
