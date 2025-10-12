import express from "express"
import { ServiceRoutes } from "./serviceRoutes.mjs";
import morgan from 'morgan'
const prefix = ""

/**
 * @remarks
 * This function sets up the routes for the application.
 * @param {express.Application} app - The express application instance.
 */
function initRoutes(app) {
    app.use(morgan("dev")); // Log requests to the console
    app.use(express.json({ limit: "25mb" }));
    app.use(express.urlencoded({ limit: '25mb', extended: true }));

    const serviceRoutes = new ServiceRoutes();

    /**
     * The routes for the services, ..., are defined here.
     */
    app.use(`${prefix}/services`, serviceRoutes.getRouter());

}

export default initRoutes