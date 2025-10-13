import Ticket from "../components/ticket.mjs";
import db from "./db.mjs";

class TicketDAO {
    /**
     * @returns a new ticket-code string for a specific service
     */
    getNewTicketCode(serviceId) {
        return new Promise((resolve, reject) => {
            // Getting the service code
            let sql = `SELECT S.code, (COUNT(T.ticket_id) + 1) AS ticket_count
                FROM SERVICES S
                LEFT JOIN TICKETS T
                ON T.service_id = S.service_id
                AND DATE(T.issue_time) = DATE('now', 'localtime')
                GROUP BY S.service_id, S.code
                HAVING S.service_id = ?`;
            
            db.get(sql, [serviceId], (err, row) => {
                if (err) reject(err);
                else resolve(row.code + row.ticket_count);
            });
        });
    }

    /**
     * @returns a new ticket for the given service
     */
    getTicket(serviceId) {
        return new Promise(async (resolve, reject) => {
            const issue_time = new Date().toISOString().slice(0, 19).replace("T", " "); // format YYYY-MM-DD HH:mm:ss
            const ticket_code = await this.getNewTicketCode(serviceId);

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