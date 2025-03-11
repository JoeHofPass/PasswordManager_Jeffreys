{
  "targets": [
    {
      'target_name': "addon",
      "sources": [
        "backend/addon.cc", "backend/DBconnection.cpp", "backend/passwordHash.cpp"
      ],
      "cflags": ["-std=c++17"],
      "ldflags": ["-stdlib=libc++"],
      "libraries": ["-lc++"],

      'include_dirs': [
        "<!@(node -p \"require('node-addon-api').include\")", 
        "/opt/homebrew/Cellar/libsodium/1.0.20/include",
        "/opt/homebrew/Cellar/postgresql@17/17.4/include",
        "/opt/homebrew/include"
        ],
      'libraries': [
          "/opt/homebrew/Cellar/postgresql@17/17.4/lib/postgresql/libpq.a",
          "/opt/homebrew/Cellar/libsodium/1.0.20/lib/libsodium.a"
        ],

      'dependencies': [
          "<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except_all"
          ]
    }
  ]
}
