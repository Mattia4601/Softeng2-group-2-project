import { test, expect, jest, describe, beforeAll } from "@jest/globals";
import request from 'supertest';
import { app } from '../../index.mjs';
import ServiceDAO from "../../src/dao/serviceDao.mjs";
import Service from "../../src/components/service.mjs";

const baseURL = "";
let sampleService = new Service(1, 'A', 'sample-service', 'sample-desc', 5);

jest.mock("../../src/dao/serviceDAO.mjs");

describe("Unit tests for ServiceRoutes", () => {
    describe("Route for getting the services", () => {
        test("GET services", async () => {
            //We mock the ServiceDAO getServices method to return Service[], because we are not testing the ServiceDAO logic here (we assume it works correctly)
            jest.spyOn(ServiceDAO.prototype, "getServices").mockResolvedValueOnce([sampleService]);

            /*We send a request to the route we are testing. We are in a situation where:
                - The input parameters are 'valid' (= the validation logic is mocked to be correct)
                - The service getter function is 'successful' (= the ServiceDAO logic is mocked to be correct)
                We expect the 'getServices' function to have been called with the input parameters and to return a 200 success code
                Since we mock the dependencies and we are testing the route in isolation, we do not need to check that the services have actually been retrieved
            */
            const response = await request(app).get(`${baseURL}/services`);
            expect(response.status).toBe(200);
            expect(ServiceDAO.prototype.getServices).toHaveBeenCalled();
            expect(ServiceDAO.prototype.getServices).toHaveBeenCalledWith();
        });
    });
});