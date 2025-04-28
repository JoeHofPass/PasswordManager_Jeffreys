#include <iostream>
#include <cstring>
#include <vector>
#include <sstream>
#include <libpq-fe.h>
#include <sodium.h>
#include "DBconnection.h"
#include "passwordHash.h"
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

//#define DB_CONN "dbname=GateKeep user=postgres password=IntersteLL@r_@5201 host=localhost port=5433"
#define DB_CONN "dbname=GateKeep user=teamuser password=IntersteLL@r_@5202 host=database-1.c3yyqymmofip.us-east-2.rds.amazonaws.com port=5432"

#define SALT_BYTES crypto_pwhash_SALTBYTES
#define KEY_BYTES crypto_aead_aegis256_KEYBYTES
#define NONCE_BYTES crypto_aead_aegis256_NPUBBYTES
#define MAC_BYTES crypto_aead_aegis256_ABYTES

unsigned char userKey[KEY_BYTES];


int keyFromPassword(const char *password, const unsigned char *salt, unsigned char *key_out)
{
    return crypto_pwhash(key_out, KEY_BYTES, password, strlen(password), salt, crypto_pwhash_OPSLIMIT_SENSITIVE,
    crypto_pwhash_MEMLIMIT_SENSITIVE, crypto_pwhash_ALG_DEFAULT);
}

int encrypt(const unsigned char *plaintext, size_t plaintextLen, unsigned char *ciphertext_withNonce)
{
    unsigned char nonce[NONCE_BYTES];
    randombytes_buf(nonce, sizeof(nonce));
    //size_t ciphertextLen = plaintextLen + crypto_aead_aegis256_ABYTES;
    unsigned char *ciphertext = ciphertext_withNonce + NONCE_BYTES;
    memcpy(ciphertext_withNonce, nonce, NONCE_BYTES);


    int result = crypto_aead_aegis256_encrypt(ciphertext, NULL, plaintext, plaintextLen, NULL, 0, NULL, nonce, userKey);
    if (result != 0)
    {
        fprintf(stderr, "Encryption failed with error %d\n", result);
        return -1;
    } else {
        printf("Encryption successful\n");
    }

    return 1;
}

int decrypt(const unsigned char *ciphertext_withNonce, size_t ciphertextLen_withNonce, unsigned char *plaintext, size_t *plaintextLen)
{
    unsigned char nonce[NONCE_BYTES];
    const unsigned char *ciphertext = ciphertext_withNonce + NONCE_BYTES;
    memcpy(nonce, ciphertext_withNonce, NONCE_BYTES);
    size_t ciphertextLen = ciphertextLen_withNonce - NONCE_BYTES;

    unsigned long long actualDecryptedLen = 0;
    int result = crypto_aead_aegis256_decrypt(plaintext, &actualDecryptedLen, NULL, ciphertext, ciphertextLen, NULL, 0, nonce, userKey);
    if (result != 0)
    {
        fprintf(stderr, "Decryption failed with error %d\n", result);
        return -1;
    } else {
        printf("Decryption successful\n");
    }
    *plaintextLen = (size_t)(actualDecryptedLen);
    return 1;
}

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
    size_t servicePasswordLen = strlen(servicePassword);
    size_t ciphertextLenTotal = servicePasswordLen + NONCE_BYTES + crypto_aead_aegis256_ABYTES;
    unsigned char *ciphertext_withNonce = (unsigned char *)malloc(ciphertextLenTotal);
    if (ciphertext_withNonce == NULL)
    {
        fprintf(stderr, "Memory allocation failed\n");
        return 0;
    }
    if (encrypt((const unsigned char *)servicePassword, servicePasswordLen, ciphertext_withNonce) != 1)
    {
        fprintf(stderr, "Encryption failed\n");
        free(ciphertext_withNonce);
        return 0;
    }

    const char *updatePassword = "UPDATE credentials SET service_name = $1, service_username = $2, service_password = $3 WHERE user_id = $4 AND password_id = $5";
    const char *updateCreds[] = {serviceName, serviceUsername, (const char *)ciphertext_withNonce, userID.c_str(), password_id};
    int paramLengths[] = {0, 0, static_cast<int>(ciphertextLenTotal), 0, 0};
    int paramFormats[] = {0, 0, 1, 0, 0};
    PGresult *updateRes = PQexecParams(conn, updatePassword, 5, NULL, updateCreds, paramLengths, paramFormats, 0);
    if (PQresultStatus(updateRes) != PGRES_COMMAND_OK)
    {
        fprintf(stderr, "failed to update password: %s\n", PQerrorMessage(conn));
        PQclear(updateRes);
        free(ciphertext_withNonce);
        PQfinish(conn);
        return 0;
    } else printf("Password cannot be updated because it does not exist. %s\n", username);

    int updatedRows = atoi(PQcmdTuples(updateRes));
    if(updatedRows == 0)
    {
        const char *addPassword = "INSERT INTO credentials (user_id, service_name, service_username, service_password, password_id) VALUES ($1,$2,$3,$4,$5)";
        const char *creds[] = {userID.c_str(), serviceName, serviceUsername, (const char *)ciphertext_withNonce, password_id};
        int paramLengths[] = {0, 0, 0, static_cast<int>(ciphertextLenTotal), 0};
        int paramFormats[] = {0, 0, 0, 1, 0};
    
        PGresult *res = PQexecParams(conn, addPassword, 5, NULL, creds, paramLengths, paramFormats, 0);
        if (PQresultStatus(res) != PGRES_COMMAND_OK)
        {
            fprintf(stderr, "failed to store password: %s\n", PQerrorMessage(conn));
            PQclear(res);
            free(ciphertext_withNonce);
            PQfinish(conn);
            return 0;
        } else printf("Password stored successfully for %s\n", username);
        PQclear(res);
    }

    // const char *addPassword = "INSERT INTO credentials (user_id, service_name, service_username, service_password, password_id) VALUES ($1,$2,$3,$4,$5)";
    // const char *creds[] = {userID.c_str(), serviceName, serviceUsername, (const char *)ciphertext_withNonce, password_id};
    // int paramLengths[] = {0, 0, 0, static_cast<int>(ciphertextLenTotal), 0};
    // int paramFormats[] = {0, 0, 0, 1, 0};

    // PGresult *res = PQexecParams(conn, addPassword, 5, NULL, creds, paramLengths, paramFormats, 0);
    // if (PQresultStatus(res) != PGRES_COMMAND_OK)
    // {
    //     fprintf(stderr, "failed to store password: %s\n", PQerrorMessage(conn));
    //     PQclear(res);
    //     free(ciphertext_withNonce);
    //     PQfinish(conn);
    //     return 0;
    // } else printf("Password stored successfully for %s\n", username);

    //PQclear(res);
    free(ciphertext_withNonce);
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
    unsigned char salt[SALT_BYTES];
    randombytes_buf(salt, sizeof(salt));

    const char *credentials[] = {fullname, username, hashed_password, pin, (const char *)(salt)};
    int paramLengths[] = {0, 0, 0, 0, static_cast<int>(sizeof(salt))};
    int paramFormats[] = {0, 0, 0, 0, 1};

    PGresult *res = PQexecParams(conn, " INSERT INTO users (fullname, username, password, pin, salt) VALUES ($1, $2, $3, $4, $5)", 5, NULL, credentials, paramLengths, paramFormats, 0);
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
        return "0";
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

    const char *getCredentials = "SELECT password, salt FROM users WHERE username = $1";
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
    unsigned char salt[SALT_BYTES];
    int saltLength = PQgetlength(res, 0, 1);
    if (saltLength > static_cast<int>(SALT_BYTES)) saltLength = static_cast<int>(SALT_BYTES);
    memcpy(salt, PQgetvalue(res, 0, 1), saltLength);
    if (crypto_pwhash_str_verify(storedHash, password, strlen(password)) != 0)
    {
        printf("Incorrect Password\n");
        PQclear(res);
        PQfinish(conn);
        return 0;
    }
    if(keyFromPassword(password, salt, userKey) != 0)
    {
        fprintf(stderr, "failed to generate key from password\n");
        PQclear(res);
        PQfinish(conn);
        return 0;
    }

    printf("user verfied!\n");
    PQclear(res);
    PQfinish(conn);
    return 1;
}

string logoutUser()
{
    sodium_memzero(userKey, sizeof(userKey));
    printf("user logged out\n");
    return "1";
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
    PGresult *res = PQexecParams(conn, callPasswords, 1, NULL, paramValues2, NULL, NULL, 1);

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

     json allPasswords = json::array();
     for (int i = 0; i < PQntuples(res); i++)
     {
         const unsigned char *ciphertext_withNonce = (const unsigned char *)PQgetvalue(res, i, 2);
         int ciphertext_withNonceLen = PQgetlength(res, i, 2);
         unsigned char *decryptedPassword = (unsigned char *)malloc(ciphertext_withNonceLen);
         size_t decryptedPasswordLen = 0;
         if (decryptedPassword == NULL)
         {
             fprintf(stderr, "Memory allocation failed\n");
             PQclear(res);
             PQfinish(conn);
             return "[]";
         }
         if (decrypt(ciphertext_withNonce, ciphertext_withNonceLen, decryptedPassword, &decryptedPasswordLen) != 1)
         {
             fprintf(stderr, "Decryption failed\n");
             free(decryptedPassword);
             PQclear(res);
             PQfinish(conn);
             return "[]";
         }

         json passwordData ={
             {"service", PQgetvalue(res, i, 0)},
             {"username", PQgetvalue(res, i, 1)},
             {"password", string((char*)decryptedPassword, decryptedPasswordLen)},
             {"password_id", PQgetvalue(res, i, 3)}
         };
         allPasswords.push_back(passwordData);
         sodium_memzero(decryptedPassword, decryptedPasswordLen);
         free(decryptedPassword);
     }
 
     PQclear(res);
     PQfinish(conn);
     return allPasswords.dump();
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
    PGresult *res = PQexecParams(conn, callPasswords, 1, NULL, paramValues2, NULL, NULL, 1);

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

    json allPasswords = json::array();
    for (int i = 0; i < PQntuples(res); i++)
    {
        const unsigned char *ciphertext_withNonce = (const unsigned char *)PQgetvalue(res, i, 2);
        int ciphertext_withNonceLen = PQgetlength(res, i, 2);
        unsigned char *decryptedPassword = (unsigned char *)malloc(ciphertext_withNonceLen);
        size_t decryptedPasswordLen = 0;
        if (decryptedPassword == NULL)
        {
            fprintf(stderr, "Memory allocation failed\n");
            PQclear(res);
            PQfinish(conn);
            return "[]";
        }
        if (decrypt(ciphertext_withNonce, ciphertext_withNonceLen, decryptedPassword, &decryptedPasswordLen) != 1)
        {
            fprintf(stderr, "Decryption failed\n");
            free(decryptedPassword);
            PQclear(res);
            PQfinish(conn);
            return "[]";
        }

        json passwordData ={
            {"service", PQgetvalue(res, i, 0)},
            {"username", PQgetvalue(res, i, 1)},
            {"password", string((char*)decryptedPassword, decryptedPasswordLen)},
            {"password_id", PQgetvalue(res, i, 3)}
        };
        allPasswords.push_back(passwordData);
        sodium_memzero(decryptedPassword, decryptedPasswordLen);
        free(decryptedPassword);
    }

    PQclear(res);
    PQfinish(conn);
    return allPasswords.dump();
}