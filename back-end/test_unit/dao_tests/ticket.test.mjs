import { describe, test, jest, expect, beforeEach, afterEach } from '@jest/globals'
import db from '../../src/dao/db.mjs';
import TicketDAO from '../../src/dao/ticketDAO.mjs';
import Ticket from '../../src/components/ticket.mjs';
import Service from '../../src/components/service.mjs';
import dayjs from 'dayjs'

let ticketDAO;
let sampleService;
let sampleTicket;

describe("Unit test for TicketDAO", () => {
    beforeEach(() => {
        ticketDAO = new TicketDAO();
        sampleService = new Service(1, 'A', 'sample-service', 'sample-desc', 5);
        sampleTicket = new Ticket(1, `${sampleService.code}1`, sampleService.service_id, dayjs().format("YYYY-MM-DD HH:mm:ss"));
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("getTicket(serviceId)", () => {
        test("Success - Should return a Ticket type", async () => {
            const mockDBGet = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
                callback(null, {code: sampleService.code, ticket_count: 1});
            });
            const mockDBRun = jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {
                callback.call({ lastID: 1, changes: 1}, null);   // function({lastID: ..., changes: ...}) sqlite
                return {};
            });

            const result = await ticketDAO.getTicket(sampleService.service_id);
            // Preventing issues with this.lastID
            result.ticket_id = sampleTicket.ticket_id;
            expect(result).toEqual(sampleTicket);
            expect(mockDBRun).toHaveBeenCalled();
            expect(mockDBGet).toHaveBeenCalled();
        });
    });
});