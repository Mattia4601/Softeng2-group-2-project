import sqlite from "sqlite3";

const dbFilePath = "../database/database.db"

// The database is created and the foreign keys are enabled.
const db = new sqlite.Database(dbFilePath, (err) => {
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
});

export default db;