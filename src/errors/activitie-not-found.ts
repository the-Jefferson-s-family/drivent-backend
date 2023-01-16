import { ApplicationError } from "@/protocols";

export function activitieNotFound(): ApplicationError {
  return {
    name: "ActivitieNotFound",
    message: "Activity not found!",
  };
}
