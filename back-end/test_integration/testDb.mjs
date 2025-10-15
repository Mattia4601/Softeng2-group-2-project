import sqlite from "sqlite3";
import fs from "fs";
import path from "path";

/**
 * Test database configuration
 * Exports helpers to initialize, get and close the test DB instance
 */

const TEST_DB_PATH = "./test_integration/test_database.db";

let db = null;
let initPromise = null;

export function getTestDb() {
    if (!db) throw new Error('Test DB not initialized. Call initTestDb() first.');
    return db;
}

export function cleanupTestDatabase() {
    if (fs.existsSync(TEST_DB_PATH)) {
        try {
            fs.unlinkSync(TEST_DB_PATH);
        } catch (err) {
            console.warn("Could not delete test database:", err.message);
        }
    }
}

export function closeTestDb() {
    return new Promise((resolve, reject) => {
        if (!db) return resolve();
        db.close((err) => {
            if (err) return reject(err);
            db = null;
            initPromise = null;
            resolve();
        });
    });
}

export function initTestDb() {
    if (initPromise) return initPromise;

    initPromise = new Promise((resolve, reject) => {
        // remove existing test database if it exists
        if (fs.existsSync(TEST_DB_PATH)) {
            try {
                fs.unlinkSync(TEST_DB_PATH);
            } catch (err) {
                // non-fatal
                console.warn("Could not delete existing test database:", err.message);
            }
        }

        db = new sqlite.Database(TEST_DB_PATH, (err) => {
            if (err) return reject(err);
            db.run("PRAGMA foreign_keys = ON", (pragmaErr) => {
                if (pragmaErr) return reject(pragmaErr);

                try {
                    const ddlPath = path.join(process.cwd(), "..", "database", "tables_DDL.sql");
                    const ddl = fs.readFileSync(ddlPath, "utf8");
                    db.exec(ddl, (ddlErr) => {
                        if (ddlErr) return reject(ddlErr);

                        try {
                            const defaultValuesPath = path.join(process.cwd(), "..", "database", "tables_default_values.sql");
                            const defaultValues = fs.readFileSync(defaultValuesPath, "utf8");
                            db.exec(defaultValues, (dvErr) => {
                                if (dvErr) return reject(dvErr);
                                resolve(db);
                            });
                        } catch (fsErr) {
                            return reject(fsErr);
                        }
                    });
                } catch (fsErr) {
                    return reject(fsErr);
                }
            });
        });
    });

    return initPromise;
}

export default getTestDb;
