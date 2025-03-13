#include <node.h>
#include <napi.h>
#include "DBconnection.h"
#include "passwordHash.h"

Napi::String NewUser(const Napi::CallbackInfo& credentials){
    Napi::Env env = credentials.Env();
    Napi::String fullname = credentials[0].As<Napi::String>();
    Napi::String username = credentials[1].As<Napi::String>();
    Napi::String password = credentials[2].As<Napi::String>();


    if(newUser(fullname.Utf8Value().c_str(), username.Utf8Value().c_str(), password.Utf8Value().c_str())){
        return Napi::String::New(env, "1");
    } else {
        return Napi::String::New(env, "0");
    }
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
Napi::Object Init(Napi::Env credentials, Napi::Object exports) {
    exports.Set("newUser", Napi::Function::New(credentials, NewUser));
    exports.Set("verifyUser", Napi::Function::New(credentials, VerifyUser));
    return exports;
}
NODE_API_MODULE(addon, Init);