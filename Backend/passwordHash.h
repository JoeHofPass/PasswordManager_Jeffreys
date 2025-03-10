#ifndef USER_MANAGEMENT_H
#define USER_MANAGEMENT_H

#include <libpq-fe.h>

void hashPassword(const char *password, char *hashedPassword);
void newUser(const char *username, const char *password);
int verifyUser(const char *username, const char *password);

#endif