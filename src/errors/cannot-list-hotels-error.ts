import { ApplicationError } from "@/protocols";

export function cannotListHotelsError(): ApplicationError {
  return {
    name: "cannotListHotelsError",
    message: "Cannot list hotels!",
  };
}
export function notIncludeHotel(): ApplicationError {
  return {
    name: "notIncludeHotel",
    message: "Does not include hotel"
  };
}
