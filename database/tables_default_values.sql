--------- TABLES DEFAULT VALUE ------------
INSERT INTO COUNTERS (counter_name) VALUES ('Counter 1');
INSERT INTO COUNTERS (counter_name) VALUES ('Counter 2');
INSERT INTO COUNTERS (counter_name) VALUES ('Counter 3');


INSERT INTO SERVICES (code, name, description, avg_service_time) 
VALUES ('S', 'Shipping', 'Handles parcel shipments', 5);
INSERT INTO SERVICES (code, name, description, avg_service_time) 
VALUES ('P', 'Payments', 'Handles bill payments and deposits', 7);
INSERT INTO SERVICES (code, name, description, avg_service_time) 
VALUES ('A', 'Account', 'Account-related services', 10);

-- Counter 1 can do all services
INSERT INTO COUNTER_SERVICE_MAP (counter_id, service_id) VALUES (1, 1);
INSERT INTO COUNTER_SERVICE_MAP (counter_id, service_id) VALUES (1, 2);
INSERT INTO COUNTER_SERVICE_MAP (counter_id, service_id) VALUES (1, 3);

-- Counter 2 can only do Shipping and Payments
INSERT INTO COUNTER_SERVICE_MAP (counter_id, service_id) VALUES (2, 1);
INSERT INTO COUNTER_SERVICE_MAP (counter_id, service_id) VALUES (2, 2);

-- Counter 3 can only do Account service
INSERT INTO COUNTER_SERVICE_MAP (counter_id, service_id) VALUES (3, 3);
