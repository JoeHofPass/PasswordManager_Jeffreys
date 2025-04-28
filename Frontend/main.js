// Import necessary modules
const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");

let addon;

// Handle Squirrel events as early as possible
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Correctly load addon depending on environment
if (app.isPackaged) {
  addon = require(path.join(
    process.resourcesPath,
    "app",
    "build",
    "Release",
    "addon.node"
  ));
} else {
  addon = require(path.join(__dirname, "..", "build", "Release", "addon.node"));
}

let mainWindow;

// Function to create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    icon: path.join(__dirname, "..", "gatekeep4_ico.ico"), // <-- Correct path
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "login.html")); // ✅ (login.html is inside Frontend)
}

// Electron app lifecycle events
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

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
    //event.reply("login-response", NEWUSER === "1" ? {status : "success" , fullname}: "fail");
  } catch (error) {
    console.error("native module crashed:", error);
    event.reply("login-response", "error");
  }
});

ipcMain.on("register", (event, { fullname, email, password }) => {
  try {
    const NEWUSER = addon.newUser(fullname, email, password);
    event.reply("register-response", NEWUSER === "1" ? "success" : "fail");
  } catch (error) {
    console.error("native module crashed:", error);
    event.reply("register-response", "error");
  }
});

ipcMain.on(
  "store-password",
<<<<<<< Updated upstream
  (event, { email, serviceName, serviceUsername, servicePassword }) => {
=======
  (
    event,
    { email, serviceName, serviceUsername, servicePassword, password_id }
  ) => {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    //console.log("Recieved email:" ,email);
    const passwordsJSON = addon.getPasswords(email);
    //console.log(passwordsJSON);
    const passwords = JSON.parse(passwordsJSON);
    //console.log(passwords);
=======
    const passwordsJSON = addon.getPasswords(email);
    const passwords = JSON.parse(passwordsJSON);
>>>>>>> Stashed changes
    event.reply("get-passwords-response", passwords);
  } catch (error) {
    console.error("native module crashed:", error);
    event.reply("get-passwords-response", "error");
  }
});

<<<<<<< Updated upstream
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
=======
ipcMain.on("restoreORdelete", (event, { email, password_id, zeroORone }) => {
  try {
    const result = addon.restoreOrDeletePassword(email, password_id, zeroORone);
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
    const deletedPasswordsJSON = addon.getDeletedPasswords(email);
    const deletedPasswords = JSON.parse(deletedPasswordsJSON);
    event.reply("get-deletedpasswords-response", deletedPasswords);
  } catch (error) {
    console.error("native module crashed:", error);
    event.reply("get-deletedpasswords-response", "error");
  }
>>>>>>> Stashed changes
});
