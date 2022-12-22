import { unauthorizedError } from "@/errors";
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
  activities.map( activitie => 
    activitie.vacancies = (Number(activitie.vacancies) - activitie.ActivitiesSubscription.length)
  );
  activities.map( activitie => 
    delete activitie.ActivitiesSubscription
  );
  return activities;
}

const activitiesService = {
  getActivities,
};

export default activitiesService;
