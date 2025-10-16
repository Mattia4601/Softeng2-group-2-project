import { describe, test, jest, expect, beforeEach, afterEach } from '@jest/globals';
import db from '../../src/dao/db.mjs';
import CounterDAO from '../../src/dao/counterDAO.mjs';
import Service from '../../src/components/service.mjs';
import Counter from '../../src/components/counter.mjs';

let counterDAO;
let sampleCounter;

describe("Unit tests for CounterDAO", () => {
    beforeEach(() => {
        counterDAO = new CounterDAO();
        sampleCounter = new Counter(1, 'Counter-1'); // constructor: (id, name)
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("getAllCounters()", () => {
        test("Success - Should return a Counter[] type", async () => {
            const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
                callback(null, [
                    sampleCounter
                ]);   // function(err, rows) sqlite style
            });

            const result = await counterDAO.getAllCounters();
            expect(result).toEqual([sampleCounter]);
            expect(mockDBAll).toHaveBeenCalled();
        });
    });
});
