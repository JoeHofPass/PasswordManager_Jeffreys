const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const addon = require("../build/Release/addon.node");

let mainWindow;
function createWindow () {
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 1000,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });
    //mainWindow.webContents.openDevTools();
    mainWindow.loadFile('login.html');
    mainWindow.webContents.on('did-fail-load', () => {
      console.log("Page loaded: ", mainWindow.webContents.getURL());
    });
  }

  ipcMain.on('login', (event, {email, password}) => {
    try {
      const NEWUSER = addon.verifyUser(email,password);
      event.reply("login-response", NEWUSER === "1" ? "success" : "fail");
    } catch (error) {
      console.error("native module crashed:", error);
      event.reply("login-reponse", "error");
    }
  });

  ipcMain.on('register', (event, {fullname, email, password}) => {
    try {
      const NEWUSER = addon.newUser(fullname, email, password);
      event.reply("register-response", NEWUSER === "1" ? "success" : "fail");
    } catch (error) {
      console.error("native module crashed:", error);
      event.reply("register-response", "error");
    }
  });

  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
