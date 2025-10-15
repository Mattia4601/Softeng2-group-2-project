import express from "express";
import TicketDAO from "../dao/ticketDAO.mjs";
import { sendWebSocketMessage } from "./websocket.mjs";
import ServiceDAO from "../dao/serviceDAO.mjs";
import CounterDAO from "../dao/counterDAO.mjs";

class CounterRoutes {
  router;
  ticketDAO;
  counterDAO;

  constructor() {
    this.router = express.Router();
    this.ticketDAO = new TicketDAO();
    this.counterDAO = new CounterDAO;
    this.initRoutes();
  }

  getRouter() {
    return this.router;
  }

  initRoutes() {

    this.router.get("/", async (req, res) => {
      try {
        const counters = await this.counterDAO.getAllCounters();
        return res.status(200).json(counters);
      } catch (err) {
        console.error("Error fetching counters:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    /*
     * Route called when a counter clicks on button "new ticket", this will call the method
     * getNextWaitingTicketForCounter in charge of getting the next ticket to be served and to
     * change its statu from "WAITING" to "IN PROGRESS"
     * 
     * Return codes:
     * 400 - Bad Request
     * 204 - No content
     * 200 - OK
     * 500 - Internal Server Error
    */
    this.router.post(
      "/:counterId/next-ticket",
      async (req, res) => {
        try {
        
          const counterId = Number(req.params.counterId);

          if (!Number.isInteger(counterId) || counterId <= 0) {
            return res.status(400).json({ error: "Invalid or missing counterId" });
          }

          const ticketId = await this.ticketDAO.getNextWaitingTicketForCounter(counterId);
          // There are no people waiting for being served by this counter
          if (ticketId === null) {
            return res.status(204).send();
          }

          return res.status(200).json({ ticketId });
        }
        catch (err) {
          console.error("Error calling next ticket:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );
  }
}

export { CounterRoutes };