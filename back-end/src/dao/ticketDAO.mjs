import Ticket from "../components/ticket.mjs";
import db from "./db.mjs";
import dayjs from "dayjs";

class TicketDAO {
    /**
     * This section was added to allow the possibility of using a different db for test purpose through "new TicketDAO(testDb)"
     * While in production phase we use the normal db through new TicketDAO()
     */
    constructor(database = null) {
        this.db = database || db;
    }

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
            
            this.db.get(sql, [serviceId], (err, row) => {
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
            const issue_time = dayjs().format("YYYY-MM-DD HH:mm:ss"); // format YYYY-MM-DD HH:mm:ss
            const ticket_code = await this.getNewTicketCode(serviceId);

            const sql = `INSERT INTO TICKETS (ticket_code, service_id, issue_time)
                        VALUES (?, ?, ?)`;
            this.db.run(sql, [ticket_code, serviceId, issue_time], function(err) {
                if (err) reject(err);
                else resolve(
                    new Ticket(this.lastID, ticket_code, serviceId, issue_time)
                );
            });
        });
    }

    

    /**
     * Fucntion that changes status of a ticket from "IN PROGRESS" to "SERVED" and set closed time
     */
    closeTicket(ticketId) {
        return new Promise((resolve, reject) => {
            if (!ticketId){
                return reject(new Error("ticketId is required!"));
            }
            
            const updateQuery = `UPDATE TICKETS
                                SET status = 'SERVED', closed_time = DATETIME('now','localtime')
                                WHERE ticket_id = ? AND status = 'IN PROGRESS' AND closed_time IS NULL`;
            this.db.run(updateQuery, ticketId, function (err) {
                if (err)
                    return reject(err);
                return resolve(this.changes);  // 0 no update done, 1 updated successfully
            });                   
        });
    }

    /**
     * Returns the next WAITING ticket that can be served by the given counter.
     * It uses COUNTER_SERVICE_MAP to filter tickets by the services offered at the counter
     * and selects the one with the smallest ticket_id which it should be the one that has been
     * waiting for the longest time.
     * If the method finds a new ticket to assign to the counter then the method also takes care of
     * updating the ticket status to IN PROGRESS.
     * - input: counterId 
     * - output: ticket_id
     * - error: rejects on DB errors or if counterId is invalid
     */
    getNextWaitingTicketForCounter(counterId) {
        return new Promise((resolve, reject) => {
            if (counterId === undefined || counterId === null) {
                return reject(new Error("counterId is required!"));
            }
            const db = this.db;
            // to serialize the db operations inside this block
            db.serialize(()=>{
                // get exclusive lock on db to avoid race conditions on database
                db.run("BEGIN IMMEDIATE TRANSACTION", (beginErr) => {
                    if (beginErr) return reject(beginErr);

                    const selectSql = `
                                        SELECT T.ticket_id, T.ticket_code
                                        FROM TICKETS T, COUNTER_SERVICE_MAP CSM 
                                        WHERE CSM.service_id = T.service_id AND CSM.counter_id = ? AND T.status = 'WAITING'
                                        ORDER BY T.ticket_id ASC
                                        LIMIT 1
                                    `;

                    db.get(selectSql, [counterId], (selErr, row)=>{
                        if (selErr) {
                            db.run("ROLLBACK"); // to release the lock acquired with BEGIN IMMEDIATE TRANSACTION
                            return reject(selErr);
                            }
                        if (!row) { // no new ticket found for the services delivered by this counter 
                            db.run("ROLLBACK");
                            return resolve(null);
                        }

                        // update ticket status to 'IN PROGRESS'
                        const updateSql = `
                                            UPDATE TICKETS
                                            SET status = 'IN PROGRESS', counter_id = ?
                                            WHERE ticket_id = ? AND status = 'WAITING'
                                            `;
                    
                        db.run(updateSql, [counterId, row.ticket_id], function (updErr) {
                            if (updErr) {
                                db.run("ROLLBACK");
                                return reject(updErr);
                            }

                            // if no rows have been updated then we just release the lock, no commit needed
                            if (this.changes !== 1) {
                                
                                db.run("ROLLBACK");
                                return resolve(null);
                            }

                            db.run("COMMIT", (commitErr) => {
                                if (commitErr) return reject(commitErr);
                                resolve({ ticket_id: row.ticket_id, ticket_code: row.ticket_code });
                            });
                        
                        });
                    });
                });

                
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