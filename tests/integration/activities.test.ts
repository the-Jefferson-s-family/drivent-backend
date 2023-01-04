import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createPayment,
  createTicketTypePresential,
  createActivities,
  createActivitiesSubscription,
  createActivitiesAdd2days,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /activities", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities/date");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities/date").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities/date").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 when user has a activities ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const activities = await createActivities(9, 11);
      await createActivitiesSubscription(user.id, activities.id);
      const response = await server.get(`/activities/date?date=${activities.date}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([
        expect.objectContaining(
          {
            id: activities.id,
            title: activities.title,
            vacancies: activities.vacancies - 1,
            local: activities.local,
            date: activities.date.toISOString(),
            startTime: activities.startTime.toISOString(),
            finishTime: activities.finishTime.toISOString(),
          }
        )
      ]
      );
    });

    it("should respond with status 200 when when no activity found for that date ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get(`/activities/date?date=${2}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(expect.arrayContaining([]));
    });

    it("should respond with status 401 when ticket isn't paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);

      const activities = await createActivities(9, 11);

      const response = await server.get(`/activities/date?date=${activities.date}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when enrollment not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const activities = await createActivities(9, 11);

      const response = await server.get(`/activities/date?date=${activities.date}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 404 when date is underfined", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/date").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe("POST /activities", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/activities/date/2");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/activities/date/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/activities/date/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 when the user was registered in the activity ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const activities = await createActivities(9, 11);
      const activities2 = await createActivities(11, 13);
      const activities3 = await createActivities(14, 15);

      await createActivitiesSubscription(user.id, activities3.id);
      await createActivitiesSubscription(user.id, activities2.id);
      const response = await server.post(`/activities/date?date=${activities.date}&activitieId=${activities.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
    });

    it("should respond with status 200 when the user was registered in the activity ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const activities = await createActivities(9, 11);
      const activitie2 = await createActivitiesAdd2days(15, 18);

      await createActivitiesSubscription(user.id, activitie2.id);

      const response = await server.post(`/activities/date?date=${activities.date}&activitieId=${activities.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
    });

    it("should respond with status 409 when there is a conflict of schedules.", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const activities = await createActivities(9, 11);
      const activities2 =await createActivities(9, 11);
      await createActivities(9, 11);
      await createActivitiesSubscription(user.id, activities.id);
      await createActivitiesSubscription(user.id, activities2.id);
      const response = await server.post(`/activities/date?date=${activities.date}&activitieId=${activities.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.CONFLICT);
    });

    it("should respond with status 401 when ticket isn't paid ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);

      const activities = await createActivities(9, 11);
  
      const response = await server.post(`/activities/date?date=${activities.date}&activitieId=${activities.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when enrollment not found ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypePresential();

      const activities = await createActivities(9, 11);
  
      const response = await server.post(`/activities/date?date=${activities.date}&activitieId=${activities.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 404 when activities not found ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      
      const response = await server.post("/activities/date?date=2023-01-05T00:00:00.000Z&activitieId=2").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when when starTime and finishTime are equal or starTime is bigger finishTime ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypePresential();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const activitie = await createActivities(8, 8);

      const response = await server.post(`/activities/date?date=${activitie.date}&activitieId=${activitie.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});
