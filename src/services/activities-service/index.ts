import { activitieNotFound, conflictError, notFoundError, unauthorizedError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Activities } from "@prisma/client";

async function getActivities(date: Date, userId: number): Promise<Activities[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote) {
    throw unauthorizedError();
  }

  const activities = await activitiesRepository.findAllActivities(date);
  activities.map(activitie =>
    activitie.vacancies = (Number(activitie.vacancies) - activitie.ActivitiesSubscription.length)
  );
  activities.map(activitie =>
    delete activitie.ActivitiesSubscription
  );
  return activities;
}

async function postSelectNewActivity(userId: number, activitieId: number, date: Date) {
  const activities = await getActivities(date, userId);
  if (!activities || activities.length === 0) {
    throw activitieNotFound();
  }
  
  const activitie = await activitiesRepository.findActivitiesById(activitieId);
  const startTime = activitie.startTime.getHours();
  const finishTime = activitie.finishTime.getHours();

  if(startTime === finishTime || startTime > finishTime) {
    throw notFoundError();
  }

  const arrayActivitiesIdToday = activities.map(actv => actv.id);
  const userActivities = await activitiesRepository.findUserActivities(userId);
  const userActivitiesId = userActivities.map(actv => actv.activitiesId);
  const ativitiesIdDoUsuarioParaToday: number[] = [];
  
  if (userActivities.length > 0) {
    for (let i = 0; i < arrayActivitiesIdToday.length; i++) {
      for (let j = 0; j < userActivitiesId.length; j++) {
        if (arrayActivitiesIdToday[i] === userActivitiesId[j]) {
          ativitiesIdDoUsuarioParaToday.push(userActivitiesId[j]);
        }
      }
    }
    
    if (ativitiesIdDoUsuarioParaToday.length < 1) {
      await activitiesRepository.creatActivitiesWithUser(userId, activitieId);
    }

    const ativitiesDoUsuarioParaToday: Activities[] = [];
    for (let i = 0; i < ativitiesIdDoUsuarioParaToday.length; i++) {
      await activitiesRepository.findActivitiesById(ativitiesIdDoUsuarioParaToday[i]).then(resp => {
        ativitiesDoUsuarioParaToday.push(resp);
      });
    }

    ativitiesDoUsuarioParaToday.map(actv => {
      if (
        (startTime <= actv.startTime.getHours() && finishTime > actv.finishTime.getHours()) ||
        (startTime <= actv.startTime.getHours() && finishTime > actv.startTime.getHours()) || 
        (startTime < actv.finishTime.getHours() && finishTime > actv.finishTime.getHours())
      ) {
        throw conflictError("conflict over work hours");
      }
    });
    
    await activitiesRepository.creatActivitiesWithUser(userId, activitieId);
  }
  await activitiesRepository.creatActivitiesWithUser(userId, activitieId);
}

const activitiesService = {
  getActivities,
  postSelectNewActivity
};

export default activitiesService;
