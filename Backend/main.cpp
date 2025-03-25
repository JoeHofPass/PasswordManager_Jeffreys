#include <iostream>
#include <sodium.h>
#include "passwordHash.h"

int main(){
    if (sodium_init() < 0){
        // the library was not initialized!
        exit(EXIT_FAILURE);
    }
    return 0;
}