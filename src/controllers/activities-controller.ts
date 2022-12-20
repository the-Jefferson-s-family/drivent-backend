import { notFoundError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import dayjs from "dayjs";
import { Response } from "express";
import httpStatus from "http-status";

export async function listActivitiesByDate(req: AuthenticatedRequest, res: Response) {
  const { date } =  req.query as { date: string }; 
  const { userId } = req;
  try {
    if(!date) {
      throw notFoundError();
    }
    
    const newDate = dayjs(date);
    const activities = await activitiesService.getActivities(newDate.toDate(), Number(userId));

    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

