import express, { Router } from "express"
//import { body, param } from "express-validator"
import ServiceDAO from "../dao/serviceDao.mjs";

class ServiceRoutes {
    router;
    serviceDAO;

    /**
     * Constructs a new instance of the ServiceRoutes class.
     */
    constructor() {
        this.router = express.Router();
        this.serviceDAO = new ServiceDAO();
        this.initRoutes();
    }

    getRouter() {
        return this.router;
    }

    initRoutes() {
        /**
         * Route for getting the services
         */
        this.router.get(
            "/",
            //this.errorHandler.validateRequest,
            (req, res, next) => this.serviceDAO.getServices()
                .then((services) => res.status(200).json(services))
                .catch((err) => { res.status(500).json(err) })
        );

    }
}

export {ServiceRoutes}