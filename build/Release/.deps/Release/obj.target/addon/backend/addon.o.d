cmd_Release/obj.target/addon/backend/addon.o := c++ -o Release/obj.target/addon/backend/addon.o ../backend/addon.cc '-DNODE_GYP_MODULE_NAME=addon' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-D_GLIBCXX_USE_CXX11_ABI=1' '-D_DARWIN_USE_64_BIT_INODE=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-DNODE_ADDON_API_CPP_EXCEPTIONS_ALL' '-DNAPI_CPP_EXCEPTIONS' '-DBUILDING_NODE_EXTENSION' -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/src -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/openssl/config -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/openssl/openssl/include -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/uv/include -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/zlib -I/Users/yashpatel/Library/Caches/node-gyp/23.9.0/deps/v8/include -I/Users/yashpatel/Documents/GitHub/PasswordManager_Jeffreys/node_modules/node-addon-api -I/opt/homebrew/include -I../node_modules/node-addon-api  -O3 -gdwarf-2 -fno-strict-aliasing -flto -mmacosx-version-min=10.7 -arch arm64 -Wall -Wendif-labels -W -Wno-unused-parameter -std=gnu++20 -stdlib=libc++ -fno-rtti -MMD -MF ./Release/.deps/Release/obj.target/addon/backend/addon.o.d.raw   -c
Release/obj.target/addon/backend/addon.o: ../backend/addon.cc \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/node.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/cppgc/common.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8config.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-array-buffer.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-local-handle.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-handle-base.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-internal.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-object.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-maybe.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-persistent-handle.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-weak-callback-info.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-primitive.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-data.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-value.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-sandbox.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-traced-handle.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-container.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-context.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-snapshot.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-isolate.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-callbacks.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-promise.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-debug.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-script.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-memory-span.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-message.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-embedder-heap.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-exception.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-function-callback.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-microtask.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-statistics.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-unwinder.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-embedder-state-scope.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-date.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-extension.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-external.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-function.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-template.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-initialization.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-platform.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-source-location.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-json.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-locker.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-microtask-queue.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-primitive-object.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-proxy.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-regexp.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-typed-array.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-value-serializer.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-version.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-wasm.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/node_version.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/node_api.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/js_native_api.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/js_native_api_types.h \
  /Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/node_api_types.h \
  /Users/yashpatel/Documents/GitHub/PasswordManager_Jeffreys/node_modules/node-addon-api/napi.h \
  /Users/yashpatel/Documents/GitHub/PasswordManager_Jeffreys/node_modules/node-addon-api/napi-inl.h \
  /Users/yashpatel/Documents/GitHub/PasswordManager_Jeffreys/node_modules/node-addon-api/napi-inl.deprecated.h \
  ../backend/DBconnection.h /opt/homebrew/include/libpq-fe.h \
  /opt/homebrew/include/postgres_ext.h \
  /opt/homebrew/include/pg_config_ext.h ../backend/passwordHash.h
../backend/addon.cc:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/node.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/cppgc/common.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8config.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-array-buffer.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-local-handle.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-handle-base.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-internal.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-object.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-maybe.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-persistent-handle.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-weak-callback-info.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-primitive.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-data.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-value.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-sandbox.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-traced-handle.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-container.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-context.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-snapshot.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-isolate.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-callbacks.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-promise.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-debug.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-script.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-memory-span.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-message.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-embedder-heap.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-exception.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-function-callback.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-microtask.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-statistics.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-unwinder.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-embedder-state-scope.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-date.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-extension.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-external.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-function.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-template.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-initialization.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-platform.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-source-location.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-json.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-locker.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-microtask-queue.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-primitive-object.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-proxy.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-regexp.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-typed-array.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-value-serializer.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-version.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/v8-wasm.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/node_version.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/node_api.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/js_native_api.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/js_native_api_types.h:
/Users/yashpatel/Library/Caches/node-gyp/23.9.0/include/node/node_api_types.h:
/Users/yashpatel/Documents/GitHub/PasswordManager_Jeffreys/node_modules/node-addon-api/napi.h:
/Users/yashpatel/Documents/GitHub/PasswordManager_Jeffreys/node_modules/node-addon-api/napi-inl.h:
/Users/yashpatel/Documents/GitHub/PasswordManager_Jeffreys/node_modules/node-addon-api/napi-inl.deprecated.h:
../backend/DBconnection.h:
/opt/homebrew/include/libpq-fe.h:
/opt/homebrew/include/postgres_ext.h:
/opt/homebrew/include/pg_config_ext.h:
../backend/passwordHash.h:
