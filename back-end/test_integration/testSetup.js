import sqlite from "sqlite3";
import fs from "fs";
import path from "path";

/**
 * Test database setup utility
 * Creates a fresh test database for each test suite
 */

const TEST_DB_PATH = "./test_integration/test_database.db";

export function createTestDatabase() {
    // Remove existing test database if it exists
    if (fs.existsSync(TEST_DB_PATH)) {
        try {
            fs.unlinkSync(TEST_DB_PATH);
        } catch (err) {
            // If we can't delete it, it might be in use, that's ok
            console.warn("Could not delete existing test database:", err.message);
        }
    }

    // Create new test database
    const db = new sqlite.Database(TEST_DB_PATH, (err) => {
        if (err) throw err;
        db.run("PRAGMA foreign_keys = ON"); //enables foreign key
    });

    return db;
}

export function setupTestTables(db) {
    return new Promise((resolve, reject) => {
        const ddlPath = path.join(process.cwd(), "..", "database", "tables_DDL.sql");
        const ddl = fs.readFileSync(ddlPath, "utf8");
        
        db.exec(ddl, (err) => { // execute the sql script in tables_DDL.sql
            if (err) reject(err);
            else resolve();
        });
    });
}

export function insertTestData(db) {
    return new Promise((resolve, reject) => {
        const defaultValuesPath = path.join(process.cwd(), "..", "database", "tables_default_values.sql");
        const defaultValues = fs.readFileSync(defaultValuesPath, "utf8");
        
        db.exec(defaultValues, (err) => { // execute the sql script tables_default_values.sql
            if (err) reject(err);
            else resolve();
        });
    });
}

export function closeTestDatabase(db) {
    return new Promise((resolve) => {
        db.close((err) => {
            if (err) console.error("Error closing test database:", err);
            resolve();
        });
    });
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
