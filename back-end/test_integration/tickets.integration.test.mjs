import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { initTestDb, getTestDb, closeTestDb, cleanupTestDatabase } from './testDb.mjs';
import { TicketRoutes } from '../src/routes/ticketsRoutes.mjs';

describe('Integration Tests - GET /tickets', () => {
    let app;
    let ticketRoutes;
    let db;

    beforeAll(async () => {
        // Setup test database once for all tests
        await initTestDb();
    });


    beforeEach(() => {
        // Create fresh Express app for each test
        app = express();
        app.use(express.json());
        app.use(cors());
        
        // Create ticket routes instance with test database
        db = getTestDb();
        ticketRoutes = new TicketRoutes(db);
        app.use('/api/tickets', ticketRoutes.getRouter());
    });

    afterEach(async () => {
        // Clean up tickets table after each test
        return new Promise((resolve) => {
            db.run("DELETE FROM TICKETS", (err) => {
                if (err) console.error("Error cleaning up tickets:", err);
                resolve();
            });
        });
    });

    afterAll(async () => {
        // Close DB and cleanup file
        cleanupTestDatabase();
        await closeTestDb();
        
    });

    describe('GET /api/tickets', () => {
        test('Success - Should create and return a new ticket for valid service', async () => {
            // Arrange: Insert a test service first
            await new Promise((resolve, reject) => {
                const db = getTestDb();
                db.run(
                    "INSERT INTO SERVICES (code, name, description, avg_service_time) VALUES (?, ?, ?, ?)",
                    ['T', 'Test Service', 'Test Description', 5],
                    function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    }
                );
            });

            // Act: Make request to get ticket
            const response = await request(app)
                .get('/api/tickets')
                .query({ serviceId: 1 })
                .expect(200);

            // Assert: Check response structure and content
            expect(response.body).toHaveProperty('ticket_id');
            expect(response.body).toHaveProperty('ticket_code');
            expect(response.body).toHaveProperty('service_id', 1);
            expect(response.body).toHaveProperty('issue_time');
            expect(response.body).toHaveProperty('status', 'WAITING');
            expect(response.body).toHaveProperty('closed_time', '');
            expect(response.body).toHaveProperty('counter_id', null);
                        
            // Check issue_time format
            expect(response.body.issue_time).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        test('Error - Should return 400 when serviceId is missing', async () => {
            // Act & Assert
            const response = await request(app)
                .get('/api/tickets')
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Missing query parameter: serviceId');
        });

        test('Error - Should return 400 when serviceId is empty', async () => {
            // Act & Assert
            const response = await request(app)
                .get('/api/tickets')
                .query({ serviceId: '' })
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Missing query parameter: serviceId');
        });

        /* test('Error - Should return 500 when serviceId does not exist', async () => {
            // Act & Assert
            const response = await request(app)
                .get('/api/tickets')
                .query({ serviceId: 999 })
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal server error');
        }); */

        test('Success - Should create multiple tickets with sequential numbers', async () => {
            // Arrange: Insert a test service
            await new Promise((resolve, reject) => {
                const db = getTestDb();
                db.run(
                    "INSERT INTO SERVICES (code, name, description, avg_service_time) VALUES (?, ?, ?, ?)",
                    ['M', 'Multiple Test Service', 'Multiple Test Description', 3],
                    function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    }
                );
            });

            // Act: Create multiple tickets
            const response1 = await request(app)
                .get('/api/tickets')
                .query({ serviceId: 5 })
                .expect(200);

            const response2 = await request(app)
                .get('/api/tickets')
                .query({ serviceId: 5 })
                .expect(200);

            // Assert: Check that ticket codes are sequential
            expect(response1.body.ticket_code).toBe('M1');
            expect(response2.body.ticket_code).toBe('M2');
            
            // Check that ticket_ids are different
            expect(response1.body.ticket_id).not.toBe(response2.body.ticket_id);
        });

       
    });
});
