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
    const response = await server.get("/activities");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

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

      const activities = await createActivities();

      const response = await server.get(`/activities/date?date=${activities.date}`).set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: activities.id,
            title: activities.title,
            vacancies: activities.vacancies,
            local: activities.local,
            date: activities.date.toISOString(),
            startTime: activities.startTime.toISOString(),
            finishTime: activities.finishTime.toISOString()
          }
        ])
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

      const activities = await createActivities();

      const response = await server.get(`/activities/date?date=${activities.date}`).set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when enrollment not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const activities = await createActivities();

      const response = await server.get(`/activities/date?date=${activities.date}`).set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
  });
});
