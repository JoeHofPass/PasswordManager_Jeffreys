const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openExternal: (url) => {
    if (typeof url === "string") {
      shell.openExternal(url);
    }
  },
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => {
    ipcRenderer.removeAllListeners(channel);
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  once: (channel, callback) => {
    ipcRenderer.once(channel, (event, ...args) => callback(...args));
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
});
