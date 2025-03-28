#ifndef DB_CONNECTION_H
#define DB_CONNECTION_H
#include <libpq-fe.h>

void checkConn(PGconn *conn);
PGconn* connPGDB(const char *conninfo);

#endif