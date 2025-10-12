/**
 * Creates a new instance of the Service class.
 * @param service_id - The service identifier inside the database
 * @param code - 
 * @param name - The name of the service
 * @param description - The description of the service
 * @param avg_service_time - The average waiting time for the service
 */
class Service {
    constructor(service_id, code, name, description, avg_service_time) {
        this.service_id = service_id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.avg_service_time = avg_service_time;
    }
}

export default Service;