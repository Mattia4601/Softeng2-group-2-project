/**
 * Creates a new instance of the Ticket class.
 * @param ticket_id - The ticket identifier inside the database
 * @param ticket_code - 
 * @param service_id - The ID of the service
 * @param issue_time - Time the ticket has been issued
 * @param status - 'WAITING', 'SERVED', 'CANCELLED'
 * @param closed_time - Time the ticket has been closed
 * @param counter_id - The ID of the counter
 */
class Ticket {
    constructor(ticket_id, ticket_code, service_id, issue_time, status='WAITING', closed_time, counter_id) {
        this.ticket_id = ticket_id;
        this.ticket_code = ticket_code;
        this.service_id = service_id;
        this.issue_time = issue_time;
        this.status = status;
        this.closed_time = closed_time;
        this.counter_id = counter_id;
    }
}