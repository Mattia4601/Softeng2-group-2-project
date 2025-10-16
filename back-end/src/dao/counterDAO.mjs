import db from "./db.mjs";
import Service from "../components/service.mjs";

class CounterDAO {
    /**
     * @returns the list of available counters
     */
    getAllCounters() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM COUNTERS';
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
        row.counter_id,
        row.counter_name
    );
}

export default CounterDAO;