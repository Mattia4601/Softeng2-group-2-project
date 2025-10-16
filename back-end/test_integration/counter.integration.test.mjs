import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import { initTestDb, getTestDb, closeTestDb, cleanupTestDatabase } from './testDb.mjs';
import { CounterRoutes } from '../src/routes/counterRoutes.mjs';
import TicketDAO from '../src/dao/ticketDAO.mjs';
import ServiceDAO from '../src/dao/serviceDAO.mjs';

// Mock WebSocket sender for integration test
jest.mock('../src/routes/websocket.mjs', () => ({
    sendWebSocketMessage: jest.fn(),
}));

describe('Integration Tests - CounterRoutes', () => {
    let app;
    let counterRoutes;
    let db;

    beforeAll(async () => {
        await initTestDb();
    });

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(cors());

        db = getTestDb();
        counterRoutes = new CounterRoutes();
        // Override DAOs to use test DB if needed
        counterRoutes.counterDAO.db = db;
        counterRoutes.ticketDAO.db = db;

        app.use('/api/counters', counterRoutes.getRouter());
    });

    afterEach(async () => {
        // Clean counters and tickets table
        await new Promise((resolve) => {
            db.run("DELETE FROM COUNTERS", () => resolve());
        });
        await new Promise((resolve) => {
            db.run("DELETE FROM TICKETS", () => resolve());
        });
        await new Promise((resolve) => {
            db.run("DELETE FROM SERVICES", () => resolve());
        });
    });

    afterAll(async () => {
        await cleanupTestDatabase();
    });

    describe('GET /api/counters', () => {
        test('Success - should return list of counters', async () => {
            // Arrange: Insert some counters
            await new Promise((resolve, reject) => {
                db.run(
                    "INSERT INTO COUNTERS (counter_name) VALUES (?)",
                    ['Counter 1'],
                    function(err) { if (err) reject(err); else resolve(); }
                );
            });

            const response = await request(app)
                .get('/api/counters')
                .expect(200);

            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('counter_name', 'Counter 1');
        });

        test('Error - should return 500 if DB fails', async () => {
            // Temporarily override DAO method to throw
            jest.spyOn(counterRoutes.counterDAO, 'getAllCounters').mockRejectedValueOnce(new Error('DB error'));

            const response = await request(app)
                .get('/api/counters')
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal server error');
        });
    });

    describe('POST /api/counters/:counterId/next-ticket', () => {
        test('Success - should return 204 if no ticket waiting', async () => {
            const response = await request(app)
                .post('/api/counters/1/next-ticket')
                .expect(204);
        });

        test('Success - should return 200 and ticket if one exists', async () => {
            // Arrange: Insert service and ticket
            const serviceId = await new Promise((resolve) => {
                db.run(
                    "INSERT INTO SERVICES (code, name, description, avg_service_time) VALUES (?, ?, ?, ?)",
                    ['S', 'Test Service', 'Desc', 5],
                    function(err) { resolve(this.lastID); }
                );
            });

            const ticketId = await new Promise((resolve) => {
                db.run(
                    "INSERT INTO TICKETS (ticket_code, service_id, issue_time, status) VALUES (?, ?, ?, ?)",
                    ['S1', serviceId, dayjs().format("YYYY-MM-DD HH:mm:ss"), 'WAITING'],
                    function(err) { resolve(this.lastID); }
                );
            });

            const response = await request(app)
                .post('/api/counters/1/next-ticket')
                .expect(200);

            expect(response.body).toHaveProperty('ticket_id', ticketId);
            expect(response.body).toHaveProperty('status', 'IN PROGRESS');
        });

        test('Error - should return 400 for invalid counterId', async () => {
            const response = await request(app)
                .post('/api/counters/abc/next-ticket')
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Invalid or missing counterId');
        });

        test('Error - should return 500 if DAO throws error', async () => {
            jest.spyOn(counterRoutes.ticketDAO, 'getNextWaitingTicketForCounter').mockRejectedValueOnce(new Error('DB error'));

            const response = await request(app)
                .post('/api/counters/1/next-ticket')
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal server error');
        });
    });
});
