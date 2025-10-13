import express, { Router } from "express"
//import { body, param } from "express-validator"
import TicketDAO from "../dao/ticketDAO.mjs";

class TicketRoutes {
    router;
    ticketDAO;

    /**
     * Constructs a new instance of the TicketRoutes class.
     */
    constructor() {
        this.router = express.Router();
        this.ticketDAO = new TicketDAO();
        this.initRoutes();
    }

    getRouter() {
        return this.router;
    }

    initRoutes() {
        /**
         * Route for getting a ticket for a specific service
         */
        this.router.get(
            "/",
            //this.errorHandler.validateRequest,
            async (req, res, next) => {
                try {
                    const { serviceId } = req.query;
                    if (!serviceId) {
                        return res.status(400).json({ error: "Missing query parameter: serviceId" });
                    }

                    const ticket = await this.ticketDAO.getTicket(serviceId);
                    res.status(200).json(ticket);
                } catch (err) {
                    console.error("Error fetching ticket:", err);
                    res.status(500).json({ error: "Internal server error" });
                }
            }
        );

    }
}

export { TicketRoutes }