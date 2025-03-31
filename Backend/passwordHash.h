#ifndef USER_MANAGEMENT_H
#define USER_MANAGEMENT_H

#include <libpq-fe.h>
using namespace std;
int storePassword(const char *username, const char *serviceName, const char *serviceUsername, const char *servicePassword);
void hashPassword(const char *password, char *hashedPassword);
int newUser(const char *fullname, const char *username, const char *password);
string getFullname(const char *username);
int verifyUser(const char *username, const char *password);
string getPasswords(const char *username);

#endif