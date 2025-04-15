const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),

  // Standard on (multi-listener safe)
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },

  // One-time listener
  once: (channel, callback) => {
    ipcRenderer.once(channel, (event, ...args) => callback(...args));
  },

  // Optional: if you want to clean up listeners manually
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },
});
