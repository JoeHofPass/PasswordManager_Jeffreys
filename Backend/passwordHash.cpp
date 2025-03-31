#include <iostream>
#include <cstring>
#include <vector>
#include <sstream>
#include <libpq-fe.h>
#include <sodium.h>
#include "DBconnection.h"
#include "passwordHash.h"
using namespace std;

#define DB_CONN "dbname=GateKeep user=postgres password=IntersteLL@r_@5201 host=localhost port=5433"

//add new password
int storePassword(const char *username, const char *serviceName, const char *serviceUsername, const char *servicePassword){
    PGconn *conn = connPGDB(DB_CONN);

    const char *getUserID = "SELECT id FROM users WHERE username = $1";
    PGresult *IDres = PQexecParams(conn, getUserID, 1, NULL, &username, NULL, NULL, 0);

    if(PQresultStatus(IDres) != PGRES_TUPLES_OK){
        fprintf(stderr, "failed to get user id: %s\n", PQerrorMessage(conn));
        PQclear(IDres);
        PQfinish(conn);
        return 0;
    }
    if(PQntuples(IDres) == 0){
        printf("User not in found.\n");
        PQclear(IDres);
        PQfinish(conn);
        return 0;
    }

    string userID = PQgetvalue(IDres, 0,0);
    PQclear(IDres);
    const char *addPassword = "INSERT INTO credentials (user_id, service_name, service_username, service_password) VALUES ($1,$2,$3,$4)";
    const char *creds[] = {userID.c_str(), serviceName, serviceUsername, servicePassword};

    PGresult *res = PQexecParams(conn, addPassword, 4, NULL, creds, NULL, NULL, 0);
    if(PQresultStatus(res) != PGRES_COMMAND_OK){
        fprintf(stderr, "failed to store password: %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return 0;
    } else{
        printf("Password stored successfully for %s\n", username);
    }
    PQclear(res);
    PQfinish(conn);
    return 1;
}

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

string getFullname(const char *username){
    PGconn *conn = connPGDB(DB_CONN);

    const char *getName = "SELECT fullname FROM users WHERE username = $1";
    PGresult *res = PQexecParams(conn, getName, 1, NULL, &username, NULL, NULL, 0);

    if(PQresultStatus(res) != PGRES_TUPLES_OK){
        fprintf(stderr, "failed to execute query %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return "0";
    }
    if(PQntuples(res) == 0){
        printf("Name not found\n");
        PQclear(res);
        PQfinish(conn);
        return 0;
    }
    string fullname = PQgetvalue(res, 0, 0);

    PQclear(res);
    PQfinish(conn);
    return fullname;
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

string getPasswords(const char *username){
    PGconn *conn = connPGDB(DB_CONN);

    const char *getUserID = "SELECT id FROM users WHERE username = $1";
    const char *paramValues[] = {username};
    PGresult *IDres = PQexecParams(conn, getUserID, 1, NULL, paramValues, NULL, NULL, 0);

    if(PQresultStatus(IDres) != PGRES_TUPLES_OK){
        fprintf(stderr, "failed to execute get user ID query %s\n", PQerrorMessage(conn));
        PQclear(IDres);
        PQfinish(conn);
        return "[]";
    }
    if(PQntuples(IDres) == 0){
        printf("No ID found\n");
        PQclear(IDres);
        PQfinish(conn);
        return "[]";
    }

    const char *userID = PQgetvalue(IDres, 0, 0);
    PQclear(IDres);
    const char *paramValues2[] = {userID};


    const char *callPasswords = "SELECT service_name, service_username, service_password FROM credentials WHERE user_id = $1";
    PGresult *res = PQexecParams(conn, callPasswords, 1, NULL, paramValues2, NULL, NULL, 0);

    if(PQresultStatus(res) != PGRES_TUPLES_OK){
        fprintf(stderr, "failed to execute call passwords query %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return "[]";
    }
    if(PQntuples(res) == 0){
        printf("No passwords found\n");
        PQclear(res);
        PQfinish(conn);
        return "[]";
    }
    ostringstream JSON;
    JSON << "[";
    for (int i = 0; i < PQntuples(res); i++){
        JSON << "{"
        << "\"service\": \"" << PQgetvalue(res, i, 0) << "\","
        << "\"username\": \"" << PQgetvalue(res, i, 1) << "\","
        << "\"password\": \"" << PQgetvalue(res, i, 2) << "\""
        << "}";
        if(i < PQntuples(res) - 1) JSON << ",";
    }
    JSON << "]";

    PQclear(res);
    PQfinish(conn);
    return JSON.str();
}