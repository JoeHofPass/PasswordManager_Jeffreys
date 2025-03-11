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
    mainWindow.webContents.openDevTools();

    
    mainWindow.loadFile('login.html');
  }

  ipcMain.on('login', (event, {email, password}) => {
    try {
      console.log(addon);
      const NEWUSER = addon.verifyUser(email,password);
      event.reply('login-response', NEWUSER ? 'success' : 'fail');
    } catch (error) {
      console.error("native module crashed:", error);
      event.reply("login-reponse", "error");
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
