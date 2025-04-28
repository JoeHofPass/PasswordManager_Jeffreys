const { app, BrowserWindow, ipcMain } = require("electron");
const addon = require("../build/Release/addon.node");
const path = require("path");


let mainWindow;
// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  //mainWindow.webContents.openDevTools();
  mainWindow.loadFile(path.join(__dirname, "login.html"));
  mainWindow.webContents.on("did-fail-load", () => {
    console.log("Failed to load page:", mainWindow.webContents.getURL());
  });

  // mainWindow.webContents.openDevTools(); // Optional for debugging
}

// IPC Event Handlers
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
    console.error("native module crashed during login:", error);
    event.reply("login-response", "error");
  }
});

ipcMain.on("register", (event, { fullname, email, password, pin }) => {
  try {
    const NEWUSER = addon.newUser(fullname, email, password, pin);
    event.reply("register-response", NEWUSER === "1" ? "success" : "fail");
  } catch (error) {
    console.error("native module crashed during register:", error);
    event.reply("register-response", "error");
  }
});

ipcMain.on("logout", (event) => {
  try {
    const result = addon.logoutUser();
    event.reply("logout-response", result === "1" ? "success" : "fail");
  } catch (error) {
    console.error("native module crashed during logout:", error);
  }
});

ipcMain.on("verify-pin", (event, { email, pin }) => {
  try {
    const PIN = addon.verifyPin(email, pin);
    const response = PIN === "1" ? { status: "success" } : { status: "fail" };
    event.reply("verify-pin-response", response);
  } catch (error) {
    console.error("native module crashed during verify-pin:", error);
    event.reply("verify-pin-response", "error");
  }
});

ipcMain.on(
  "store-password",
  (
    event,
    { email, serviceName, serviceUsername, servicePassword, password_id }
  ) => {
    try {
      const result = addon.storePassword(
        email,
        serviceName,
        serviceUsername,
        servicePassword,
        password_id
      );
      event.reply(
        "storePassword-response",
        result === "1" ? "success" : "fail"
      );
    } catch (error) {
      console.error("native module crashed during store-password:", error);
      event.reply("storePassword-response", "error");
    }
  }
);

ipcMain.on("get-passwords", (event, { email }) => {
  try {
    const passwordsJSON = addon.getPasswords(email);
    const passwords = JSON.parse(passwordsJSON);
    event.reply("get-passwords-response", passwords);
  } catch (error) {
    console.error("native module crashed during get-passwords:", error);
    event.reply("get-passwords-response", "error");
  }
});

ipcMain.on("restoreORdelete", (event, { email, password_id, zeroORone }) => {
  try {
    const result = addon.restoreOrDeletePassword(email, password_id, zeroORone);
    event.reply(
      "restoreORdelete-response",
      result === "1" ? "success" : "fail"
    );
  } catch (error) {
    console.error("native module crashed during restoreORdelete:", error);
    event.reply("restoreORdelete-response", "error");
  }
});

ipcMain.on("get-deletedpasswords", (event, { email }) => {
  try {
    const deletedPasswordsJSON = addon.getDeletedPasswords(email);
    const deletedPasswords = JSON.parse(deletedPasswordsJSON);
    event.reply("get-deletedpasswords-response", deletedPasswords);
  } catch (error) {
    console.error("native module crashed during get-deletedpasswords:", error);
    event.reply("get-deletedpasswords-response", "error");
  }
});

// Electron lifecycle
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
