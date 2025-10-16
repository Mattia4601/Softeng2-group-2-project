import db from "./db.mjs";
import Counter from "../components/counter.mjs";

class CounterDAO {
    /**
     * @returns the list of available counters
     */
    getAllCounters() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM COUNTERS';
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => mapRowToCounter(r)));
            });
        });
    }
}

function mapRowToCounter(row) {
    if (!row) return null; // handle nulls safely
    return new Counter(
        row.counter_id,
        row.counter_name
    );
}

export default CounterDAO;