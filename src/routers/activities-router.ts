import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listActivitiesByDate } from "@/controllers/activities-controller";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/date", listActivitiesByDate);

export { activitiesRouter };
