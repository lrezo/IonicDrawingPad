// index.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const os = require("os");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("../www/index.html"); // IMPORTANT: points to Ionic build

  // Open DevTools if you want for debugging:
  // mainWindow.webContents.openDevTools()
};

// Called when Electron is ready
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Example IPC communication
ipcMain.on("do-a-thing", (event, arg) => {
  console.log("Running in main process triggered from renderer");

  // Example node.js API call:
  let hostname = os.hostname();
  event.reply(
    "do-a-thing-reply",
    "Hi this is main process, I am running on host: " + hostname
  );
});
