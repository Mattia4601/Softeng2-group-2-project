import { test, expect, jest, describe, beforeAll } from "@jest/globals";
import request from 'supertest';
import { app } from '../../index.mjs';
import TicketDAO from "../../src/dao/ticketDAO.mjs";
import Ticket from "../../src/components/ticket.mjs";
import dayjs from 'dayjs';

const baseURL = "";
let sampleTicket = new Ticket(1, `A1`, 1, dayjs().format("YYYY-MM-DD HH:mm:ss"));

jest.mock('../../src/dao/ticketDAO.mjs');

describe("Unit tests for TicketRoutes", () => {
    describe("Route for creating a new ticket", () => {
        test("GET ticket?serviceId=1", async () => {
            //We mock the TicketDAO getTickets method to return Ticket[], because we are not testing the TicketDAO logic here (we assume it works correctly)
            jest.spyOn(TicketDAO.prototype, "getTicket").mockResolvedValueOnce(sampleTicket);

            /*We send a request to the route we are testing. We are in a situation where:
                - The input parameters are 'valid' (= the validation logic is mocked to be correct)
                - The Ticket getter function is 'successful' (= the TicketDAO logic is mocked to be correct)
                We expect the 'getTicket' function to have been called with the input parameters and to return a 200 success code
                Since we mock the dependencies and we are testing the route in isolation, we do not need to check that the services have actually been retrieved
            */
            const response = await request(app).get(`${baseURL}/ticket?serviceId=${sampleTicket.service_id}`);
            expect(response.status).toBe(200);
            expect(TicketDAO.prototype.getTicket).toHaveBeenCalled();
            expect(TicketDAO.prototype.getTicket).toHaveBeenCalledWith(1);
        });
    });
});