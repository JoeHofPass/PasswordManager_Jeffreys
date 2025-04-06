#include <node.h>
#include <napi.h>
#include <sstream>
#include "DBconnection.h"
#include "passwordHash.h"
#include <sodium.h>

Napi::String StorePassword(const Napi::CallbackInfo& credentials){
    Napi::Env env = credentials.Env();
    Napi::String username = credentials[0].As<Napi::String>();
    Napi::String serviceName = credentials[1].As<Napi::String>();
    Napi::String serviceUsername = credentials[2].As<Napi::String>();
    Napi::String servicePassword = credentials[3].As<Napi::String>();

    if(storePassword(username.Utf8Value().c_str(), serviceName.Utf8Value().c_str(), serviceUsername.Utf8Value().c_str(), servicePassword.Utf8Value().c_str())){
        return Napi::String::New(env, "1");
    } else {
        return Napi::String::New(env, "0");
    }
}

Napi::String NewUser(const Napi::CallbackInfo& credentials){
    Napi::Env env = credentials.Env();
    Napi::String fullname = credentials[0].As<Napi::String>();
    Napi::String username = credentials[1].As<Napi::String>();
    Napi::String password = credentials[2].As<Napi::String>();
    Napi::String pin = credentials[3].As<Napi::String>();


    if(newUser(fullname.Utf8Value().c_str(), username.Utf8Value().c_str(), password.Utf8Value().c_str(), pin.Utf8Value().c_str())){
        return Napi::String::New(env, "1");
    } else {
        return Napi::String::New(env, "0");
    }
}
Napi::String GetFullname(const Napi::CallbackInfo& credentials){
    Napi::Env env = credentials.Env();
    Napi::String username = credentials[0].As<Napi::String>();

    return Napi::String::New(env, getFullname(username.Utf8Value().c_str()));

}

Napi::String VerifyUser(const Napi::CallbackInfo& credentials){
    Napi::Env env = credentials.Env();
    Napi::String username = credentials[0].As<Napi::String>();
    Napi::String password = credentials[1].As<Napi::String>();

    if(verifyUser(username.Utf8Value().c_str(), password.Utf8Value().c_str())){
        return Napi::String::New(env, "1");
    } else {
        return Napi::String::New(env, "0");
    }
}

Napi::String VerifyPin(const Napi::CallbackInfo& credentials){
    Napi::Env env = credentials.Env();
    Napi::String username = credentials[0].As<Napi::String>();
    Napi::String pin = credentials[1].As<Napi::String>();

    if(verifyPin(username.Utf8Value().c_str(), pin.Utf8Value().c_str())){
        return Napi::String::New(env, "1");
    } else {
        return Napi::String::New(env, "0");
    }
}

Napi::String GetPasswords(const Napi::CallbackInfo& credentials){
    Napi::Env env = credentials.Env();
    std::string username = credentials[0].As<Napi::String>().Utf8Value();

    std::string JSON = getPasswords(username.c_str());
    return Napi::String::New(env, JSON);
}

Napi::String GetDeletedPasswords(const Napi::CallbackInfo& credentials){
    Napi::Env env = credentials.Env();
    std::string username = credentials[0].As<Napi::String>().Utf8Value();

    std::string JSON = getDeletedPasswords(username.c_str());
    return Napi::String::New(env, JSON);
}

Napi::String Main(const Napi::CallbackInfo& credentials) {
    Napi::Env env = credentials.Env();
    if (sodium_init() < 0) {
        Napi::TypeError::New(env, "Failed to initialize libsodium").ThrowAsJavaScriptException();
        return Napi::String::New(env, "1");
    }
    return Napi::String::New(env, "Libsodium initialized successfully");
}

Napi::Object Init(Napi::Env credentials, Napi::Object exports) {
    exports.Set("storePassword", Napi::Function::New(credentials, StorePassword));
    exports.Set("newUser", Napi::Function::New(credentials, NewUser));
    exports.Set("getFullname", Napi::Function::New(credentials, GetFullname));
    exports.Set("verifyUser", Napi::Function::New(credentials, VerifyUser));
    exports.Set("verifyPin", Napi::Function::New(credentials, VerifyPin));
    exports.Set("getPasswords", Napi::Function::New(credentials, GetPasswords));
    exports.Set("getDeletedPasswords", Napi::Function::New(credentials, GetDeletedPasswords));
    exports.Set(Napi::String::New(credentials, "Main"), Napi::Function::New(credentials, Main));

    return exports;
}
NODE_API_MODULE(addon, Init);