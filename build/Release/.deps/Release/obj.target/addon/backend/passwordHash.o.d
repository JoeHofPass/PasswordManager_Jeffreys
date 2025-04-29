cmd_Release/obj.target/addon/backend/passwordHash.o := c++ -o Release/obj.target/addon/backend/passwordHash.o ../backend/passwordHash.cpp '-DNODE_GYP_MODULE_NAME=addon' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-D_GLIBCXX_USE_CXX11_ABI=1' '-DELECTRON_ENSURE_CONFIG_GYPI' '-D_DARWIN_USE_64_BIT_INODE=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-DUSING_ELECTRON_CONFIG_GYPI' '-DV8_COMPRESS_POINTERS' '-DV8_COMPRESS_POINTERS_IN_ISOLATE_CAGE' '-DV8_31BIT_SMIS_ON_64BIT_ARCH' '-DV8_ENABLE_SANDBOX' '-DOPENSSL_NO_PINSHARED' '-DOPENSSL_THREADS' '-DOPENSSL_NO_ASM' '-DNODE_ADDON_API_CPP_EXCEPTIONS_ALL' '-DNAPI_CPP_EXCEPTIONS' '-DBUILDING_NODE_EXTENSION' -I/Users/yashpatel/.electron-gyp/35.2.1/include/node -I/Users/yashpatel/.electron-gyp/35.2.1/src -I/Users/yashpatel/.electron-gyp/35.2.1/deps/openssl/config -I/Users/yashpatel/.electron-gyp/35.2.1/deps/openssl/openssl/include -I/Users/yashpatel/.electron-gyp/35.2.1/deps/uv/include -I/Users/yashpatel/.electron-gyp/35.2.1/deps/zlib -I/Users/yashpatel/.electron-gyp/35.2.1/deps/v8/include -I/Users/yashpatel/Documents/GitHub/PasswordManager_Jeffreys/node_modules/node-addon-api -I/opt/homebrew/Cellar/libsodium/1.0.20/include -I/opt/homebrew/Cellar/postgresql@17/17.4/include -I/opt/homebrew/include -I../node_modules/node-addon-api  -O3 -gdwarf-2 -fno-strict-aliasing -mmacosx-version-min=10.7 -arch arm64 -Wall -Wendif-labels -W -Wno-unused-parameter -std=gnu++20 -stdlib=libc++ -fno-rtti -MMD -MF ./Release/.deps/Release/obj.target/addon/backend/passwordHash.o.d.raw   -c
Release/obj.target/addon/backend/passwordHash.o: \
  ../backend/passwordHash.cpp /opt/homebrew/include/libpq-fe.h \
  /opt/homebrew/include/postgres_ext.h \
  /opt/homebrew/include/pg_config_ext.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/version.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/export.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/core.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_aegis128l.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_aegis256.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_aes256gcm.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_chacha20poly1305.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_xchacha20poly1305.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_auth.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_auth_hmacsha512256.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_auth_hmacsha512.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_hash_sha512.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_auth_hmacsha256.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_hash_sha256.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_box.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_box_curve25519xsalsa20poly1305.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_xsalsa20.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_hchacha20.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_hsalsa20.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_salsa20.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_salsa2012.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_salsa208.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_generichash.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_generichash_blake2b.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_hash.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kdf.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kdf_blake2b.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kdf_hkdf_sha256.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kdf_hkdf_sha512.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kx.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_onetimeauth.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_onetimeauth_poly1305.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_pwhash.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_pwhash_argon2i.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_pwhash_argon2id.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_scalarmult.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_scalarmult_curve25519.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_secretbox.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_secretbox_xsalsa20poly1305.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_secretstream_xchacha20poly1305.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_chacha20.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_shorthash.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_shorthash_siphash24.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_sign.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_sign_ed25519.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_salsa20.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_verify_16.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_verify_32.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_verify_64.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/randombytes.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/randombytes_internal_random.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/randombytes_sysrandom.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/runtime.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/utils.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_box_curve25519xchacha20poly1305.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_xchacha20.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_ed25519.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_ristretto255.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_pwhash_scryptsalsa208sha256.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_scalarmult_ed25519.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_scalarmult_ristretto255.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_secretbox_xchacha20poly1305.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_salsa2012.h \
  /opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_salsa208.h \
  ../backend/DBconnection.h ../backend/passwordHash.h \
  ../backend/json.hpp
../backend/passwordHash.cpp:
/opt/homebrew/include/libpq-fe.h:
/opt/homebrew/include/postgres_ext.h:
/opt/homebrew/include/pg_config_ext.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/version.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/export.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/core.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_aegis128l.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_aegis256.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_aes256gcm.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_chacha20poly1305.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_aead_xchacha20poly1305.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_auth.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_auth_hmacsha512256.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_auth_hmacsha512.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_hash_sha512.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_auth_hmacsha256.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_hash_sha256.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_box.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_box_curve25519xsalsa20poly1305.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_xsalsa20.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_hchacha20.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_hsalsa20.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_salsa20.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_salsa2012.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_salsa208.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_generichash.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_generichash_blake2b.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_hash.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kdf.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kdf_blake2b.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kdf_hkdf_sha256.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kdf_hkdf_sha512.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_kx.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_onetimeauth.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_onetimeauth_poly1305.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_pwhash.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_pwhash_argon2i.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_pwhash_argon2id.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_scalarmult.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_scalarmult_curve25519.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_secretbox.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_secretbox_xsalsa20poly1305.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_secretstream_xchacha20poly1305.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_chacha20.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_shorthash.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_shorthash_siphash24.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_sign.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_sign_ed25519.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_salsa20.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_verify_16.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_verify_32.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_verify_64.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/randombytes.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/randombytes_internal_random.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/randombytes_sysrandom.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/runtime.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/utils.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_box_curve25519xchacha20poly1305.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_xchacha20.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_ed25519.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_core_ristretto255.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_pwhash_scryptsalsa208sha256.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_scalarmult_ed25519.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_scalarmult_ristretto255.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_secretbox_xchacha20poly1305.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_salsa2012.h:
/opt/homebrew/Cellar/libsodium/1.0.20/include/sodium/crypto_stream_salsa208.h:
../backend/DBconnection.h:
../backend/passwordHash.h:
../backend/json.hpp:
