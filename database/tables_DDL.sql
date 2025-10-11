--------- CREAZIONE TABELLE ------------

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS LOG_SERVICES_SERVED;
DROP TABLE IF EXISTS TICKETS;
DROP TABLE IF EXISTS COUNTER_SERVICE_MAP;
DROP TABLE IF EXISTS SERVICES;
DROP TABLE IF EXISTS COUNTERS;

----------------------------------------
-- COUNTERS
----------------------------------------
CREATE TABLE COUNTERS (
    counter_id      INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    counter_name    TEXT NOT NULL UNIQUE -- e.g. "Counter 1"
);

----------------------------------------
-- SERVICES
----------------------------------------
CREATE TABLE SERVICES (
    service_id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    code                TEXT NOT NULL UNIQUE,
    name                TEXT NOT NULL UNIQUE, -- e.g. "Shipping", "Account"
    description         TEXT,
    avg_service_time    INTEGER NOT NULL      -- stored in minutes or seconds
);

----------------------------------------
-- COUNTER_SERVICE_MAP (Many-to-Many)
----------------------------------------
CREATE TABLE COUNTER_SERVICE_MAP (
    counter_id      INTEGER NOT NULL, -- references COUNTERS.counter_id
    service_id      INTEGER NOT NULL, -- references SERVICES.service_id
    PRIMARY KEY (counter_id, service_id),
    FOREIGN KEY (counter_id) REFERENCES COUNTERS(counter_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES SERVICES(service_id) ON DELETE CASCADE
);

----------------------------------------
-- TICKETS
----------------------------------------
CREATE TABLE TICKETS (
    ticket_id       INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    ticket_code     TEXT NOT NULL UNIQUE, -- printed on screen / for customers
    service_id      INTEGER NOT NULL,     -- references SERVICES.service_id
    issue_time      TEXT NOT NULL,        -- format YYYY-MM-DD HH:mm:ss
    status          TEXT NOT NULL DEFAULT('WAITING') 
                     CHECK(status IN ('WAITING', 'SERVED', 'CANCELLED')),
    closed_time     TEXT,                -- format YYYY-MM-DD HH:mm:ss null until served or cancelled
    counter_id      INTEGER,             -- filled once served
    FOREIGN KEY (service_id) REFERENCES SERVICES(service_id),
    FOREIGN KEY (counter_id) REFERENCES COUNTERS(counter_id)
);

----------------------------------------
-- LOG_SERVICES_SERVED (for statistics per day/week/month)
----------------------------------------
CREATE TABLE LOG_SERVICES_SERVED (
    log_id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    counter_id      INTEGER NOT NULL, -- references COUNTERS.counter_id
    service_id      INTEGER NOT NULL, -- references SERVICES.service_id
    ticket_id       INTEGER NOT NULL, -- references TICKETS.ticket_id
    FOREIGN KEY (counter_id) REFERENCES COUNTERS(counter_id),
    FOREIGN KEY (service_id) REFERENCES SERVICES(service_id),
    FOREIGN KEY (ticket_id) REFERENCES TICKETS(ticket_id)
);
