const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const addon = require("../build/Release/addon.node");

let mainWindow;
function createWindow () {
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 1000,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    //mainWindow.webContents.openDevTools();
  
    mainWindow.loadFile('login.html')
  }

  ipcMain.on('login', (event, {email, password}) => {
    const NEWUSER = addon.verifyUser(email,password);
    event.reply('login-response', NEWUSER ? 'success' : 'fail');
  });

  app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
