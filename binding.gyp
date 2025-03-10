{
  "targets": [
    {
      'target_name': "addon",
      "sources": [
        "backend/addon.cc"
      ],
      "cflags": ["-std=c++17"],
      "ldflags": ["-stdlib=libc++"],
      "libraries": ["-lc++"],
    'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")", "/opt/homebrew/include"],
    'dependencies': ["<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except_all"],
    }
  ]
}
