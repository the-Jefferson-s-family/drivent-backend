import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listActivitiesByDate, selectNewActivity } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/date", listActivitiesByDate)
  .post("/date", selectNewActivity);

export { activitiesRouter };
