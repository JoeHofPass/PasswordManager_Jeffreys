#include <iostream>
#include <cstring>
#include <vector>
#include <sstream>
#include <libpq-fe.h>
#include <sodium.h>
#include "DBconnection.h"
#include "passwordHash.h"
using namespace std;

//#define DB_CONN "dbname=GateKeep user=postgres password=IntersteLL@r_@5201 host=localhost port=5433"
#define DB_CONN "dbname=GateKeep user=teamuser password=IntersteLL@r_@5202 host=database-1.c3yyqymmofip.us-east-2.rds.amazonaws.com port=5432"

// add new password
int storePassword(const char *username, const char *serviceName, const char *serviceUsername, const char *servicePassword, const char *password_id)
{
    PGconn *conn = connPGDB(DB_CONN);

    const char *getUserID = "SELECT id FROM users WHERE username = $1";
    PGresult *IDres = PQexecParams(conn, getUserID, 1, NULL, &username, NULL, NULL, 0);

    if (PQresultStatus(IDres) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to get user id: %s\n", PQerrorMessage(conn));
        PQclear(IDres);
        PQfinish(conn);
        return 0;
    }
    if (PQntuples(IDres) == 0)
    {
        printf("User not in found.\n");
        PQclear(IDres);
        PQfinish(conn);
        return 0;
    }

    string userID = PQgetvalue(IDres, 0, 0);
    PQclear(IDres);
    const char *addPassword = "INSERT INTO credentials (user_id, service_name, service_username, service_password, password_id) VALUES ($1,$2,$3,$4,$5)";
    const char *creds[] = {userID.c_str(), serviceName, serviceUsername, servicePassword, password_id};

    PGresult *res = PQexecParams(conn, addPassword, 5, NULL, creds, NULL, NULL, 0);
    if (PQresultStatus(res) != PGRES_COMMAND_OK)
    {
        fprintf(stderr, "failed to store password: %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return 0;
    }
    else
    {
        printf("Password stored successfully for %s\n", username);
    }
    PQclear(res);
    PQfinish(conn);
    return 1;
}

// hashes a password
void hashPassword(const char *password, char *hashedPassword)
{
    if (crypto_pwhash_str(hashedPassword, password, strlen(password), crypto_pwhash_OPSLIMIT_SENSITIVE, crypto_pwhash_MEMLIMIT_SENSITIVE) != 0)
    {
        fprintf(stderr, "password hashing failure");
        exit(EXIT_FAILURE);
    }
}

// create new user and add credentials to database
int newUser(const char *fullname, const char *username, const char *password, const char *pin)
{
    PGconn *conn = connPGDB(DB_CONN);

    const char *existingUser = "SELECT 1 FROM users WHERE username = $1 LIMIT 1";
    PGresult *checkUser = PQexecParams(conn, existingUser, 1, NULL, &username, NULL, NULL, 0);
    if (PQresultStatus(checkUser) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to check if user exists: %s\n", PQerrorMessage(conn));
        PQclear(checkUser);
        PQfinish(conn);
        return 0;
    }

    if (PQntuples(checkUser) > 0)
    {
        printf("Email already in used \n");
        PQclear(checkUser);
        PQfinish(conn);
        return 0;
    }
    PQclear(checkUser);

    char hashed_password[crypto_pwhash_STRBYTES];
    hashPassword(password, hashed_password);
    const char *credentials[] = {fullname, username, hashed_password, pin};

    PGresult *res = PQexecParams(conn, " INSERT INTO users (fullname, username, password, pin) VALUES ($1, $2, $3, $4)", 4, NULL, credentials, NULL, NULL, 0);
    if (PQresultStatus(res) != PGRES_COMMAND_OK)
    {
        fprintf(stderr, "failed to insert %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return 0;
    }
    else
    {
        printf("user created \n");
    }

    PQclear(res);
    PQfinish(conn);
    return 1;
}

string getFullname(const char *username)
{
    PGconn *conn = connPGDB(DB_CONN);

    const char *getName = "SELECT fullname FROM users WHERE username = $1";
    PGresult *res = PQexecParams(conn, getName, 1, NULL, &username, NULL, NULL, 0);

    if (PQresultStatus(res) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to execute query %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return "0";
    }
    if (PQntuples(res) == 0)
    {
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

// verify the user before they login
int verifyUser(const char *username, const char *password)
{
    PGconn *conn = connPGDB(DB_CONN);

    const char *getCredentials = "SELECT password FROM users WHERE username = $1";
    PGresult *res = PQexecParams(conn, getCredentials, 1, NULL, &username, NULL, NULL, 0);

    if (PQresultStatus(res) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to execute query %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return 0;
    }
    if (PQntuples(res) == 0)
    {
        printf("User not found\n");
        PQclear(res);
        PQfinish(conn);
        return 0;
    }

    const char *storedHash = PQgetvalue(res, 0, 0);
    if (crypto_pwhash_str_verify(storedHash, password, strlen(password)) != 0)
    {
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

// pin auth
int verifyPin(const char *username, const char *pin)
{
    PGconn *conn = connPGDB(DB_CONN);

    const char *getPin = "SELECT pin FROM users WHERE username = $1";
    PGresult *res = PQexecParams(conn, getPin, 1, NULL, &username, NULL, NULL, 0);

    if (PQresultStatus(res) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to execute query %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return 0;
    }
    if (PQntuples(res) == 0)
    {
        printf("pin not found\n");
        PQclear(res);
        PQfinish(conn);
        return 0;
    }

    const char *storedPin = PQgetvalue(res, 0, 0);
    if (strcmp(storedPin, pin) != 0)
    {
        printf("Incorrect pin\n");
        PQclear(res);
        PQfinish(conn);
        return 0;
    }

    printf("pin verfied!\n");
    PQclear(res);
    PQfinish(conn);
    return 1;
}

// get all deleted passwords from last 30 days
string getDeletedPasswords(const char *username)
{
    PGconn *conn = connPGDB(DB_CONN);

    const char *getUserID = "SELECT id FROM users WHERE username = $1";
    const char *paramValues[] = {username};
    PGresult *IDres = PQexecParams(conn, getUserID, 1, NULL, paramValues, NULL, NULL, 0);

    if (PQresultStatus(IDres) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to execute get user ID query %s\n", PQerrorMessage(conn));
        PQclear(IDres);
        PQfinish(conn);
        return "[]";
    }
    if (PQntuples(IDres) == 0)
    {
        printf("No ID found\n");
        PQclear(IDres);
        PQfinish(conn);
        return "[]";
    }

    const char *userID = PQgetvalue(IDres, 0, 0);
    PQclear(IDres);
    const char *paramValues2[] = {userID};

    const char *callPasswords = "SELECT service_name, service_username, service_password, password_id, deleted_at FROM credentials WHERE user_id = $1 and is_deleted = true and deleted_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'";
    PGresult *res = PQexecParams(conn, callPasswords, 1, NULL, paramValues2, NULL, NULL, 0);

    if (PQresultStatus(res) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to execute call passwords query %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return "[]";
    }
    if (PQntuples(res) == 0)
    {
        printf("No passwords found\n");
        PQclear(res);
        PQfinish(conn);
        return "[]";
    }
    ostringstream JSON;
    JSON << "[";
    for (int i = 0; i < PQntuples(res); i++)
    {
        JSON << "{"
             << "\"service\": \"" << PQgetvalue(res, i, 0) << "\","
             << "\"username\": \"" << PQgetvalue(res, i, 1) << "\","
             << "\"password\": \"" << PQgetvalue(res, i, 2) << "\","
             << "\"password_id\": \"" << PQgetvalue(res, i, 3) << "\""

             << "}";
        if (i < PQntuples(res) - 1)
            JSON << ",";
    }
    JSON << "]";

    PQclear(res);
    PQfinish(conn);
    return JSON.str();
}

int restoreOrDeletePassword(const char *username, const char *password_id, const char *zeroORone)
{
    PGconn *conn = connPGDB(DB_CONN);

    const char *getUserID = "SELECT id FROM users WHERE username = $1";
    const char *paramValues[] = {username};
    PGresult *IDres = PQexecParams(conn, getUserID, 1, NULL, paramValues, NULL, NULL, 0);

    if (PQresultStatus(IDres) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to execute get user ID query %s\n", PQerrorMessage(conn));
        PQclear(IDres);
        PQfinish(conn);
        return 0;
    }
    if (PQntuples(IDres) == 0)
    {
        printf("No ID found\n");
        PQclear(IDres);
        PQfinish(conn);
        return 0;
    }

    const char *userID = PQgetvalue(IDres, 0, 0);
    PQclear(IDres);
    const char *paramValues2[] = {userID, password_id};

    if (strcmp(zeroORone, "1") == 0)
    {
        const char *callPasswords = "UPDATE credentials SET is_deleted = false, deleted_at = null WHERE user_id = $1 and password_id = $2";
        PGresult *res = PQexecParams(conn, callPasswords, 2, NULL, paramValues2, NULL, NULL, 0);

        if (PQresultStatus(res) != PGRES_COMMAND_OK)
        {
            fprintf(stderr, "failed to restore password %s\n", PQerrorMessage(conn));
            PQclear(res);
            PQfinish(conn);
            return 0;
        }
        else
        {
            printf("password restore \n");
            PQclear(res);
            PQfinish(conn);
            return 1;
        }
    }
    else if (strcmp(zeroORone, "0") == 0)
    {
        const char *toDelete = "UPDATE credentials SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE user_id = $1 and password_id = $2";
        PGresult *res = PQexecParams(conn, toDelete, 2, NULL, paramValues2, NULL, NULL, 0);

        if (PQresultStatus(res) != PGRES_COMMAND_OK)
        {
            fprintf(stderr, "failed to delete password: %s\n", PQerrorMessage(conn));
            PQclear(res);
            PQfinish(conn);
            return 0;
        }
        else
        {
            printf("password deleted \n");
            PQclear(res);
            PQfinish(conn);
            return 1;
        }
    }
    return 1;
}

// get all passwords still in use
string getPasswords(const char *username)
{
    PGconn *conn = connPGDB(DB_CONN);

    const char *getUserID = "SELECT id FROM users WHERE username = $1";
    const char *paramValues[] = {username};
    PGresult *IDres = PQexecParams(conn, getUserID, 1, NULL, paramValues, NULL, NULL, 0);

    if (PQresultStatus(IDres) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to execute get user ID query %s\n", PQerrorMessage(conn));
        PQclear(IDres);
        PQfinish(conn);
        return "[]";
    }
    if (PQntuples(IDres) == 0)
    {
        printf("No ID found\n");
        PQclear(IDres);
        PQfinish(conn);
        return "[]";
    }

    const char *userID = PQgetvalue(IDres, 0, 0);
    PQclear(IDres);
    const char *paramValues2[] = {userID};

    const char *callPasswords = "SELECT service_name, service_username, service_password, password_id FROM credentials WHERE user_id = $1 and is_deleted = false";
    PGresult *res = PQexecParams(conn, callPasswords, 1, NULL, paramValues2, NULL, NULL, 0);

    if (PQresultStatus(res) != PGRES_TUPLES_OK)
    {
        fprintf(stderr, "failed to execute call passwords query %s\n", PQerrorMessage(conn));
        PQclear(res);
        PQfinish(conn);
        return "[]";
    }
    if (PQntuples(res) == 0)
    {
        printf("No passwords found\n");
        PQclear(res);
        PQfinish(conn);
        return "[]";
    }
    ostringstream JSON;
    JSON << "[";
    for (int i = 0; i < PQntuples(res); i++)
    {
        JSON << "{"
             << "\"service\": \"" << PQgetvalue(res, i, 0) << "\","
             << "\"username\": \"" << PQgetvalue(res, i, 1) << "\","
             << "\"password\": \"" << PQgetvalue(res, i, 2) << "\","
             << "\"password_id\": \"" << PQgetvalue(res, i, 3) << "\""


             << "}";
        if (i < PQntuples(res) - 1)
            JSON << ",";
    }
    JSON << "]";

    PQclear(res);
    PQfinish(conn);
    return JSON.str();
}

// void permanentalyDeletePassword(){
//     PGconn *conn = connPGDB(DB_CONN);

//     const char *toDelete = "DELETE from credentials WHERE is_deleted = true and deleted_at < CURRENT_TIMESTAMP - INTERVAL '30 days'";
//     printf("Query: %s\n", toDelete);
//     PGresult *res = PQexecParams(conn, toDelete, 0, NULL, NULL, NULL, NULL, 0);

//     if(PQresultStatus(res) != PGRES_COMMAND_OK){
//         fprintf(stderr, "failed to delete old passwords %s\n", PQerrorMessage(conn));
//     } else {
//         printf("old passwords deleted");
//     }
//     PQclear(res);
//     PQfinish(conn);
// }

// int main() {
//     permanentalyDeletePassword();
//     return 0;
// }