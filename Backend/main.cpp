#include <iostream>
#include <sodium.h>
#include "passwordHash.h"

int main(){
    if (sodium_init() < 0){
        // the library was not initialized!
        exit(EXIT_FAILURE);
    }

    newUser("john smith","testuser2@gmail.com", "password1234");
    //verifyUser("example@gmail.com", "abc123");
    return 0;
}