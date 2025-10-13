import Ticket from "../components/ticket.mjs";
import db from "./db.mjs";

class TicketDAO {
    /**
     * @returns a new ticket-code for a specific service
     */
    getNewTicketCode(serviceId) {
        // TODO for returning a unique code
        return 'sample-code';
    }

    /**
     * @returns a new ticket for the given service
     */
    getTicket(serviceId) {
        return new Promise((resolve, reject) => {
            const issue_time = new Date().toISOString().slice(0, 19).replace("T", " "); // format YYYY-MM-DD HH:mm:ss
            const ticket_code = this.getNewTicketCode(serviceId);

            const sql = `INSERT INTO TICKETS (ticket_code, service_id, issue_time)
                        VALUES (?, ?, ?)`;
            db.run(sql, [ticket_code, serviceId, issue_time], (err) => {
                if (err) reject(err);
                else resolve(
                    new Ticket(this.lastID, ticket_code, serviceId, issue_time)
                );
            });
        });
    }
}

function mapRowToTicket(row) {
    if (!row) return null; // handle nulls safely
    return new Ticket(
        row.ticket_id,
        row.ticket_code,
        row.service_id,
        row.issue_time,
        row.status,
        row.closed_time,
        row.counter_id
    );
}

export default TicketDAO;