#include <iostream>
#include <libpq-fe.h>
#include <sodium.h>
#include "DBconnection.h"
#include "passwordHash.h"

#define DB_CONN "dbname=GateKeep user=postgres password=IntersteLL@r_@5201 host=localhost port=5433"

//hashes a password
void hashPassword(const char *password, char *hashedPassword){
    if (crypto_pwhash_str
        (hashedPassword, password, strlen(password), crypto_pwhash_OPSLIMIT_SENSITIVE, crypto_pwhash_MEMLIMIT_SENSITIVE) != 0) {
        fprintf(stderr, "password hashing failure");
        exit(EXIT_FAILURE);
    }
}

//create new user and add credentials to database
int newUser(const char *fullname, const char *username, const char *password){
    PGconn *conn = connPGDB(DB_CONN);

    const char *existingUser = "SELECT 1 FROM users WHERE username = $1 LIMIT 1";
    PGresult *checkUser = PQexecParams(conn, existingUser, 1, NULL, &username, NULL, NULL, 0);
    if(PQresultStatus(checkUser) != PGRES_TUPLES_OK){
        fprintf(stderr, "failed to check if user exists: %s\n", PQerrorMessage(conn));
        PQclear(checkUser);
        PQfinish(conn);
        return 0;
    }

    if(PQntuples(checkUser) > 0){
        printf("Email already in used \n");
        PQclear(checkUser);
        PQfinish(conn);
        return 0;
    }
    PQclear(checkUser);

    char hashed_password[crypto_pwhash_STRBYTES];
    hashPassword(password, hashed_password);
    const char *credentials[] = {fullname, username, hashed_password};

    PGresult *res = PQexecParams(conn, " INSERT INTO users (fullname, username, password) VALUES ($1, $2, $3)", 3, NULL, credentials, NULL, NULL, 0);    
    if(PQresultStatus(res) != PGRES_COMMAND_OK){
        fprintf(stderr, "failed to insert %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return 0;
    } else {
        printf("user created \n");
    }

    PQclear(res);
    PQfinish(conn);
    return 1;
}

//verify the user before they login
int verifyUser(const char *username, const char *password){
    PGconn *conn = connPGDB(DB_CONN);

    const char *getCredentials = "SELECT password FROM users WHERE username = $1";
    PGresult *res = PQexecParams(conn, getCredentials, 1, NULL, &username, NULL, NULL, 0);

    if(PQresultStatus(res) != PGRES_TUPLES_OK){
        fprintf(stderr, "failed to execute query %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return 0;
    }
    if(PQntuples(res) == 0){
        printf("User not found\n");
        PQclear(res);
        PQfinish(conn);
        return 0;
    }

    const char *storedHash = PQgetvalue(res, 0, 0);
    if (crypto_pwhash_str_verify(storedHash, password, strlen(password)) != 0) {
        printf("Incorrect Password\n");
        PQclear(res);
        PQfinish(conn);
        return 0;
    }

    printf("user verfied!\n");
    PQclear(res);
    PQfinish(conn);
    return 1;


}