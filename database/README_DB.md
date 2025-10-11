# Office Queue Management System - Database Schema Explanation

## Enabling Foreign Keys

```sql
PRAGMA foreign_keys = ON;
```

Enables foreign key constraint enforcement in SQLite. This ensures relational integrity between linked tables.

## Table Cleanup Order

```sql
DROP TABLE IF EXISTS LOG_SERVICES_SERVED;
DROP TABLE IF EXISTS TICKETS;
DROP TABLE IF EXISTS COUNTER_SERVICE_MAP;
DROP TABLE IF EXISTS SERVICES;
DROP TABLE IF EXISTS COUNTERS;
```

Tables are dropped in reverse dependency order to avoid foreign key conflicts during recreation.

---

## `COUNTERS` Table

Stores information about service counters in the office (e.g., Counter 1, Counter 2).

| Column         | Type                     | Description                        |
| -------------- | ------------------------ | ---------------------------------- |
| `counter_id`   | INTEGER PK AUTOINCREMENT | Unique identifier for each counter |
| `counter_name` | TEXT UNIQUE NOT NULL     | Human-readable name of the counter |

---

## `SERVICES` Table

Defines all types of services offered and their estimated service times.

| Column             | Type                     | Description                            |
| ------------------ | ------------------------ | -------------------------------------- |
| `service_id`       | INTEGER PK AUTOINCREMENT | Unique ID for each service             |
| `code`             | TEXT UNIQUE NOT NULL     | Short code identifier for the service  |
| `name`             | TEXT UNIQUE NOT NULL     | Full service name                      |
| `description`      | TEXT                     | Optional descriptive text              |
| `avg_service_time` | INTEGER NOT NULL         | Estimated service time for queue logic |

---

## `COUNTER_SERVICE_MAP` Table (Many-to-Many Relationship)

Links counters to the services they can handle.

| Column       | Type                  | Description                      |
| ------------ | --------------------- | -------------------------------- |
| `counter_id` | INTEGER FK → COUNTERS | Counter that can serve a service |
| `service_id` | INTEGER FK → SERVICES | Service offered at that counter  |

Primary Key: `(counter_id, service_id)` ensures no duplicate pairings.

---

## `TICKETS` Table

Tracks all issued tickets and their status in the queue lifecycle.

| Column        | Type                     | Description                              |
| ------------- | ------------------------ | ---------------------------------------- |
| `ticket_id`   | INTEGER PK AUTOINCREMENT | Internal identifier                      |
| `ticket_code` | TEXT UNIQUE NOT NULL     | Public-facing ticket code                |
| `service_id`  | INTEGER FK → SERVICES    | Requested service type                   |
| `issue_time`  | TEXT NOT NULL            | Timestamp issued (`YYYY-MM-DD HH:mm:ss`) |
| `status`      | TEXT CHECK(...)          | WAITING, SERVED, or CANCELLED            |
| `closed_time` | TEXT                     | When ticket was served or cancelled      |
| `counter_id`  | INTEGER FK → COUNTERS    | Assigned counter once served             |

---

## `LOG_SERVICES_SERVED` Table (For Statistics)

Stores service history for reporting (daily/weekly/monthly stats).

| Column       | Type                     | Description                     |
| ------------ | ------------------------ | ------------------------------- |
| `log_id`     | INTEGER PK AUTOINCREMENT | Unique log record               |
| `counter_id` | INTEGER FK → COUNTERS    | Counter that handled the ticket |
| `service_id` | INTEGER FK → SERVICES    | Service type performed          |
| `ticket_id`  | INTEGER FK → TICKETS     | Ticket that was served          |

---

## Summary Diagram (Conceptual)

```
COUNTERS ───< COUNTER_SERVICE_MAP >─── SERVICES
    ↑                                      ↑
    │                                      │
    └──────────────< TICKETS >────────────┘
                              │
                              └────< LOG_SERVICES_SERVED >
```

This schema supports queue logic, ticket issuance, service assignment per counter, and statistical tracking.
