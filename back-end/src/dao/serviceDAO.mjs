import db from "./db.mjs";
import Service from "../components/service.mjs";

class ServiceDAO {
    /**
     * @returns the list of available services
     */
    getServices() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SERVICES';
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => mapRowToService(r)));
            });
        });
    }
}

function mapRowToService(row) {
    if (!row) return null; // handle nulls safely
    return new Service(
        row.service_id,
        row.code,
        row.name,
        row.description,
        row.avg_service_time
    );
}

export default ServiceDAO;