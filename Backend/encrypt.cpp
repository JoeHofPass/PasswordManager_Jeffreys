#include<sodium.h>
#include<string>
#include<iostream>
#include<cstdio>
#include<cstring>
using namespace std;

struct EncryptedData {
    unsigned char key[crypto_aead_aegis256_KEYBYTES];
    unsigned char nonce[crypto_aead_aegis256_NPUBBYTES];
    unsigned char *ciphertext;
    unsigned long long ciphertext_len;
};

void valGen(const unsigned char * password, EncryptedData &data) {
    crypto_aead_aegis256_keygen(data.key);
    randombytes_buf(data.nonce, sizeof(data.nonce));
    size_t plen = strlen((const char*)password);
    data.ciphertext = new unsigned char[plen + crypto_aead_aegis256_ABYTES];
}

void encrypt(const unsigned char *password, EncryptedData &data) {
    size_t plen = strlen((const char*)password);
    crypto_aead_aegis256_encrypt(
        data.ciphertext,
        &data.ciphertext_len,
        password, plen,               // plaintext and its length
        nullptr, 0,                   // no additional data
        nullptr,                      // nsec (not used)
        data.nonce,
        data.key
    );
}

bool decrypt(unsigned char *&decrypted_password, const EncryptedData &data) {
    size_t decrypted_len = data.ciphertext_len - crypto_aead_aegis256_ABYTES;
    decrypted_password = new unsigned char[decrypted_len + 1]; 

    unsigned long long actual_decrypted_len;
    int result = crypto_aead_aegis256_decrypt(
        decrypted_password,                    // output buffer
        &actual_decrypted_len,                 // actual decrypted length
        nullptr,                               // nsec (not used)
        data.ciphertext, data.ciphertext_len,  // ciphertext and its length
        nullptr, 0,                             // additional data (not used)
        data.nonce,                             // nonce used during encryption
        data.key                                // key used during encryption
    );

    if (result != 0) {
        // Decryption failed
        delete[] decrypted_password;
        decrypted_password = nullptr;
        return false;
    }

    // Null-terminate if treating as a C-string
    decrypted_password[actual_decrypted_len] = '\0';
    return true;
}

void cleanup(EncryptedData &data) {
    if (data.ciphertext != nullptr) { //
        delete[] data.ciphertext;
        data.ciphertext = nullptr;
    }
}
