import express from "express"
import { ServiceRoutes } from "./serviceRoutes.mjs";
import { TicketRoutes } from "./ticketsRoutes.mjs";
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
    const ticketRoutes = new TicketRoutes();

    /**
     * The routes for the endpoints are defined here.
     */
    app.use(`${prefix}/services`, serviceRoutes.getRouter());
    app.use(`${prefix}/ticket`, ticketRoutes.getRouter());

}

export default initRoutes