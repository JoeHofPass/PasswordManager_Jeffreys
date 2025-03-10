#include <iostream>
#include <libpq-fe.h>
#include "DBconnection.h"

//check connection with Postgres Database
void checkConn(PGconn *conn) {
    if (PQstatus(conn) != CONNECTION_OK) {
        fprintf(stderr, "Connection failed: %s\n", PQerrorMessage(conn));
        PQfinish(conn);
        exit(EXIT_FAILURE);
    }
}

//connect to database
PGconn* connPGDB(const char *conninfo){
    PGconn *conn = PQconnectdb(conninfo);
    checkConn(conn);
    return conn;
}