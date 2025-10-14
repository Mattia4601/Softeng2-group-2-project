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

        /**
         * Route to close a ticket, called when the counter in FE clicks on "close ticket", before calling the next customer.
         * 
         * Return codes:
         * 500 - Internal Server Error
         * 409 - Conflict
         * 400 - Bad Request
         * 200 - OK
         */
        this.router.post("/:ticketId/close", async (req, res) => {
            try {
                const ticketId = Number(req.params.ticketId);
                if (!Number.isInteger(ticketId) || ticketId <= 0) {
                    return res.status(400).json({ error: "Invalid or missing ticketId" });
                }

                const changes = await this.ticketDAO.closeTicket(ticketId);
                if (changes === 0) {
                    // No update: ticket not in IN PROGRESS status or already closed or non-existent
                    return res.status(409).json({ error: "Ticket not in progress or already closed" });
                }

                return res.status(200).json({ ticketId, status: "SERVED" });
            }
            catch (err) {
                console.error("Error closing ticket:", err);
                return res.status(500).json({ error: "Internal server error" });
            }      
        });

    }
}

export { TicketRoutes }