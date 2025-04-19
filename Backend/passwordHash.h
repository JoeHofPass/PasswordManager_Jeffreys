#ifndef USER_MANAGEMENT_H
#define USER_MANAGEMENT_H

#include <libpq-fe.h>
using namespace std;
int storePassword(const char *username, const char *serviceName, const char *serviceUsername, const char *servicePassword, const char *password_id);
void hashPassword(const char *password, char *hashedPassword);
int newUser(const char *fullname, const char *username, const char *password, const char *pin);
string getFullname(const char *username);
int verifyUser(const char *username, const char *password);
int verifyPin(const char *username, const char *pin);
string getPasswords(const char *username);
string getDeletedPasswords(const char *username);
int restoreOrDeletePassword(const char *username, const char *password_id, const char *zeroORone);

//void permanentalyDeletePassword();


#endif