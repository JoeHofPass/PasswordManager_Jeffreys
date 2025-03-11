cmd_Release/obj.target/addon/backend/DBconnection.o := c++ -o Release/obj.target/addon/backend/DBconnection.o ../backend/DBconnection.cpp '-DNODE_GYP_MODULE_NAME=addon' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-D_GLIBCXX_USE_CXX11_ABI=1' '-D_DARWIN_USE_64_BIT_INODE=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-DNODE_ADDON_API_CPP_EXCEPTIONS_ALL' '-DNAPI_CPP_EXCEPTIONS' '-DBUILDING_NODE_EXTENSION' -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/src -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/openssl/config -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/openssl/openssl/include -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/uv/include -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/zlib -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/v8/include -I/Users/yashpatel/Documents/GitHub/PasswordManager_Jeffreys/node_modules/node-addon-api -I/opt/homebrew/Cellar/libsodium/1.0.20/include -I/opt/homebrew/Cellar/postgresql@17/17.4/include -I/opt/homebrew/include -I../node_modules/node-addon-api  -O3 -gdwarf-2 -fno-strict-aliasing -flto -mmacosx-version-min=10.7 -arch arm64 -Wall -Wendif-labels -W -Wno-unused-parameter -std=gnu++20 -stdlib=libc++ -fno-rtti -MMD -MF ./Release/.deps/Release/obj.target/addon/backend/DBconnection.o.d.raw   -c
Release/obj.target/addon/backend/DBconnection.o: \
  ../backend/DBconnection.cpp /opt/homebrew/include/libpq-fe.h \
  /opt/homebrew/include/postgres_ext.h \
  /opt/homebrew/include/pg_config_ext.h ../backend/DBconnection.h
../backend/DBconnection.cpp:
/opt/homebrew/include/libpq-fe.h:
/opt/homebrew/include/postgres_ext.h:
/opt/homebrew/include/pg_config_ext.h:
../backend/DBconnection.h:
