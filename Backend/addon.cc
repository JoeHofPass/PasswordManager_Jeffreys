#include <node.h>
#include <napi.h>
#include <sstream>
#include "DBconnection.h"
#include "passwordHash.h"

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

    if(newUser(fullname.Utf8Value().c_str(), username.Utf8Value().c_str(), password.Utf8Value().c_str())){
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
// struct Passwords{
//     std::string service_name;
//     std::string service_username;
//     std::string service_password;
// };
//std::vector<Passwords> getPasswords(const char *username);
Napi::String GetPasswords(const Napi::CallbackInfo& credentials){
    Napi::Env env = credentials.Env();
    std::string username = credentials[0].As<Napi::String>().Utf8Value();

    std::string JSON = getPasswords(username.c_str());
    //std::vector<Passwords> passwords = getPasswords(username.c_str());
    // std::ostringstream JSON;
    // JSON << "[";
    // for (size_t i = 0; i < passwords.size(); i++){
    //     JSON << "{"
    //     << "\"service\": \"" << passwords[i].service_name << "\","
    //     << "\"username\": \"" << passwords[i].service_username << "\","
    //     << "\"password\": \"" << passwords[i].service_password << "\""
    //     << "}";
    //     if(i < passwords.size() - 1) JSON << ",";
    // }
    // JSON << "]";
    return Napi::String::New(env, JSON);
}

Napi::Object Init(Napi::Env credentials, Napi::Object exports) {
    exports.Set("storePassword", Napi::Function::New(credentials, StorePassword));
    exports.Set("newUser", Napi::Function::New(credentials, NewUser));
    exports.Set("getFullname", Napi::Function::New(credentials, GetFullname));
    exports.Set("verifyUser", Napi::Function::New(credentials, VerifyUser));
    exports.Set("getPasswords", Napi::Function::New(credentials, GetPasswords));

    return exports;
}
NODE_API_MODULE(addon, Init);