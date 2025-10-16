import { test, expect, jest, describe, beforeAll } from "@jest/globals";
import request from "supertest";
import { app } from "../../index.mjs";
import CounterDAO from "../../src/dao/counterDAO.mjs";
import TicketDAO from "../../src/dao/ticketDAO.mjs";
import Ticket from "../../src/components/ticket.mjs";
import dayjs from "dayjs";

// Mock WebSocket message sender
jest.mock("../../src/routes/websocket.mjs", () => ({
  sendWebSocketMessage: jest.fn(),
}));

// STATIC IMPORT of the mocked function
import { sendWebSocketMessage } from "../../src/routes/websocket.mjs";

const baseURL = "";
let sampleTicket = new Ticket(1, "A1", 1, dayjs().format("YYYY-MM-DD HH:mm:ss"));
let sampleCounters = [
  { counter_id: 1, counter_name: "Counter 1" },
  { counter_id: 2, counter_name: "Counter 2" },
];

// Mock DAOs
jest.mock("../../src/dao/counterDAO.mjs");
jest.mock("../../src/dao/ticketDAO.mjs");

describe("Unit tests for CounterRoutes", () => {

  describe("GET / counters route", () => {
    test("should return 200 and list of counters", async () => {
      jest.spyOn(CounterDAO.prototype, "getAllCounters").mockResolvedValueOnce(sampleCounters);

      const response = await request(app).get(`${baseURL}/counters`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(sampleCounters);
      expect(CounterDAO.prototype.getAllCounters).toHaveBeenCalled();
      expect(CounterDAO.prototype.getAllCounters).toHaveBeenCalledWith();
    });

    test("should return 500 if DAO throws error", async () => {
      jest.spyOn(CounterDAO.prototype, "getAllCounters").mockRejectedValueOnce(new Error("DB error"));

      const response = await request(app).get(`${baseURL}/counters`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
      expect(CounterDAO.prototype.getAllCounters).toHaveBeenCalled();
    });
  });

  describe("POST /:counterId/next-ticket route", () => {
    const { sendWebSocketMessage } = await import("../../src/routes/websocket.mjs");

    test("should return 400 for invalid counterId", async () => {
      const response = await request(app).post(`${baseURL}/counters/abc/next-ticket`);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid or missing counterId" });
    });

    test("should return 204 if no waiting tickets", async () => {
      jest.spyOn(TicketDAO.prototype, "getNextWaitingTicketForCounter").mockResolvedValueOnce(null);

      const response = await request(app).post(`${baseURL}/counters/1/next-ticket`);
      expect(response.status).toBe(204);
      expect(TicketDAO.prototype.getNextWaitingTicketForCounter).toHaveBeenCalledWith(1);
    });

    test("should return 200 and call WebSocket if ticket is found", async () => {
      jest.spyOn(TicketDAO.prototype, "getNextWaitingTicketForCounter").mockResolvedValueOnce(sampleTicket);

      const response = await request(app).post(`${baseURL}/counters/1/next-ticket`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(sampleTicket);
      expect(TicketDAO.prototype.getNextWaitingTicketForCounter).toHaveBeenCalledWith(1);
      expect(sendWebSocketMessage).toHaveBeenCalled();
    });

    test("should return 500 if DAO throws error", async () => {
      jest.spyOn(TicketDAO.prototype, "getNextWaitingTicketForCounter").mockRejectedValueOnce(new Error("DB error"));

      const response = await request(app).post(`${baseURL}/counters/1/next-ticket`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
      expect(TicketDAO.prototype.getNextWaitingTicketForCounter).toHaveBeenCalledWith(1);
    });
  });

});
