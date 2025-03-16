# {
#   "targets": [
#     {
#       'target_name': "addon",
#       "sources": [
#         "backend/addon.cc", "backend/DBconnection.cpp", "backend/passwordHash.cpp", "backend/main.cpp"
#       ],
#       "cflags": ["-std=c++17"],
#       "ldflags": ["-stdlib=libc++"],

#       'include_dirs': [
#         "<!@(node -p \"require('node-addon-api').include\")", 
#         "/opt/homebrew/Cellar/libsodium/1.0.20/include",
#         "/opt/homebrew/Cellar/postgresql@17/17.4/include",
#         "/opt/homebrew/include"
#         ],
#       'libraries': [
#           "-L/opt/homebrew/opt/libpq/lib", "-lpq",
#           "-L/opt/homebrew/Cellar/libsodium/1.0.20/lib", "-lsodium", "-lc++"
#         ],

#       'dependencies': [
#           "<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except_all"
#         ],
#         'xcode_settings': {
#           "MACOSX_DEPLOYMENT_TARGET": "15.0",
#           "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
#         }
#     }
#   ]
# }

{
  "targets": [
    {
      'target_name': "addon",
      "sources": [
        "backend/addon.cc", "backend/DBconnection.cpp", "backend/passwordHash.cpp", "backend/main.cpp"
      ],
      "cflags": ["-std=c++17"],
      "ldflags": ["-stdlib=libc++"],

      'conditions': [
          ["OS == 'mac'", {
              "include_dirs": [
                  "<!@(node -p \"require('node-addon-api').include\")", 
                  "/opt/homebrew/Cellar/libsodium/1.0.20/include",
                  "/opt/homebrew/Cellar/postgresql@17/17.4/include",
                  "/opt/homebrew/include"
                ],
              "libraries": [
                  "-L/opt/homebrew/opt/libpq/lib", "-lpq",
                  "-L/opt/homebrew/Cellar/libsodium/1.0.20/lib", "-lsodium", "-lc++"
                ],
                "dependencies": [
                    "<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except_all"
                ],
                "xcode_settings": {
                    "MACOSX_DEPLOYMENT_TARGET": "15.0",
                    "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
                }
          }
        ],
        
        ["OS == 'win'", {
            "include_dirs": [],
            "libraries": [],
              "dependencies": []
        }
      ]
    ]
    }
  ]
}
