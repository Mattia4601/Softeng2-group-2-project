# Softeng2-group-2-project

Github repository for the group project

## BE apis/socket

- POST /login : body -> type customer or counter, if counter specify counterID

- GET /services : returns services info

- GET /ticket?serviceId=1 : returns ticket for specified service

- POST counters/:counterId/next-ticket : counter calls his next customer

- POST ticket/close-ticket : body -> ticketId and success or fail

- web socket: FE listenes once gotten a ticket, BE sends message containing ticket number to be called and counter

## Usages flows

### login page flow

| actor | action                                      |
| ----- | ------------------------------------------- |
| user  | selects counter (and which one) or customer |
| user  | confirms                                    |

### customer get ticket flow

| actor  | action                                                                                       |
| ------ | -------------------------------------------------------------------------------------------- |
| system | BE gives services data and FE builds UI                                                      |
| user   | views services and book one                                                                  |
| system | BE insert new ticket and return the id                                                       |
| system | FE shows the ticket code and listens on socket waiting its call + button to close the ticket |

### counter get ticket flow

| actor  | action                                          |
| ------ | ----------------------------------------------- |
| system | FE shows close ticket button               |
| counter| clicks button to close a ticket                    |
| system | BE performs the update in the database           |
| system | FE shows button call next customer            |
| counter | counter clicks on button call next customer  |
| system | FE shows again close ticket button               |

