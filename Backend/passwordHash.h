#ifndef USER_MANAGEMENT_H
#define USER_MANAGEMENT_H

#include <libpq-fe.h>
int storePassword(const char *username, const char *serviceName, const char *serviceUsername, const char *servicePassword);
void hashPassword(const char *password, char *hashedPassword);
int newUser(const char *fullname, const char *username, const char *password);
std::string getFullname(const char *username);
int verifyUser(const char *username, const char *password);
//struct Passwords;
std::string getPasswords(const char *username);


#endif