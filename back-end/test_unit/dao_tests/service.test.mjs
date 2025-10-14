import { describe, test, jest, expect, beforeEach, afterEach } from '@jest/globals'
import db from '../../src/dao/db.mjs';
import ServiceDAO from '../../src/dao/serviceDAO.mjs';
import Service from '../../src/components/service.mjs';

let serviceDAO;
let sampleService = new Service(1, 'A', 'sample-service', 'sample-desc', 5);

describe("Unit tests for ServiceDAO", () => {
    beforeEach(() => {
        serviceDAO = new ServiceDAO();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("getServices()", () => {
        test("Success - Should return a Service[] type", async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, [
                    sampleService
                ]);   // function(err, rows) sqlite
            });

            const result = await serviceDAO.getServices();
            expect(result).toEqual([sampleService]);
            expect(mockDBAll).toHaveBeenCalled();
        });
    });
});