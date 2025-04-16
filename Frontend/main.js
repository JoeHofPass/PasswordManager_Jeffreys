const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const addon = require("../build/Release/addon.node");
const { eventNames } = require("process");

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile("login.html");
  mainWindow.webContents.on("did-fail-load", () => {
    console.log("Page loaded: ", mainWindow.webContents.getURL());
  });
}

ipcMain.on("login", (event, { email, password }) => {
  try {
    const NEWUSER = addon.verifyUser(email, password);
    let response = { status: "fail" };
    if (NEWUSER === "1") {
      const fullname = addon.getFullname(email);
      response = { status: "success", fullname };
    }
    event.reply("login-response", response);
  } catch (error) {
    console.error("native module crashed:", error);
    event.reply("login-reponse", "error");
  }
});

ipcMain.on("register", (event, { fullname, email, password, pin }) => {
  try {
    const NEWUSER = addon.newUser(fullname, email, password, pin);
    event.reply("register-response", NEWUSER === "1" ? "success" : "fail");
  } catch (error) {
    console.error("native module crashed:", error);
    event.reply("register-response", "error");
  }
});

ipcMain.on("verify-pin", (event, { email, pin }) => {
  try {
    console.log("🔐 Verifying PIN for:", email);
    const result = addon.verifyPin(email, pin);
    console.log("✅ Native module returned:", result);
    event.reply("verify-pin-response", result === 1 || result === "1");
  } catch (error) {
    console.error("verify-pin IPC failed:", error);
    event.reply("verify-pin-response", false);
  }
});

ipcMain.on(
  "store-password",
  (event, { email, serviceName, serviceUsername, servicePassword }) => {
    try {
      const result = addon.storePassword(
        email,
        serviceName,
        serviceUsername,
        servicePassword
      );
      event.reply(
        "storePassword-response",
        result === "1" ? "success" : "fail"
      );
    } catch (error) {
      console.error("native module crashed:", error);
      event.reply("storePassword-response", "error");
    }
  }
);

ipcMain.on("get-passwords", (event, { email }) => {
  try {
    //console.log("Recieved email:" ,email);
    const passwordsJSON = addon.getPasswords(email);
    //console.log(passwordsJSON);
    const passwords = JSON.parse(passwordsJSON);
    //console.log(passwords);
    event.reply("get-passwords-response", passwords);
  } catch (error) {
    console.error("native module crashed:", error);
    event.reply("get-passwords-response", "error");
  }
});

ipcMain.on("restoreORdelete", (event, { email, serviceName, zeroORone }) => {
  try {
    const result = addon.restoreOrDeletePassword(email, serviceName, zeroORone);
    event.reply(
      "restoreORdelete-response",
      result === "1" ? "success" : "fail"
    );
  } catch (error) {
    console.error("native module crashed:", error);
    event.reply("restoreORdelete-response", "error");
  }
});

ipcMain.on("get-deletedpasswords", (event, { email }) => {
  try {
    //console.log("Recieved email:" ,email);
    const deletedPasswordsJSON = addon.getDeletedPasswords(email);
    //console.log(deletedPasswordsJSON);
    const deletedPasswords = JSON.parse(deletedPasswordsJSON);
    //console.log(deletedPasswords);
    event.reply("get-deletedpasswords-response", deletedPasswords);
  } catch (error) {
    console.error("native module crashed:", error);
    event.reply("get-deletedpasswords-response", "error");
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
