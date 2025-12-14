// index.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { title } = require("process");
const { session } = require("electron");
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      sandbox: true,
      webSecurity: true,
    },
    icon: __dirname + "/www/assets/icon/favicon.png",
  });
  mainWindow.removeMenu();
  const isDev = !app.isPackaged;
  function getIndexPath() {
    if (isDev) {
      // during dev: project folder
      return "../www/index.html";
    }
    // after install: Electron copies resources under process.resourcesPath
    return "./www/index.html";
  }

  // and load the index.html of the app.
  mainWindow.loadFile(getIndexPath()); // IMPORTANT: points to Ionic build
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, url) => {
    // Only allow local file navigation
    if (!url.startsWith("file://")) {
      event.preventDefault();
    }
  });

  // Open DevTools if you want for debugging:
  // mainWindow.webContents.openDevTools()
};

// Called when Electron is ready
app.whenReady().then(() => {
  createWindow();
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      // deny everything by default
      callback(false);
    }
  );
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Example IPC communication
/*ipcMain.on("do-a-thing", (event, arg) => {
  console.log("Running in main process triggered from renderer");

  // Example node.js API call:
  let hostname = os.hostname();
  event.reply(
    "do-a-thing-reply",
    "Hi this is main process, I am running on host: " + hostname
  );
});*/

ipcMain.handle("save-image", async (event, payload) => {
  try {
    const { fileName, bytes } = payload;
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory"],
      title: "Select folder to save image",
    });
    if (result.canceled || !result.filePaths?.length) {
      return { success: false, canceled: true };
    }

    const folderPath = result.filePaths[0];
    //console.log("Selected folder:", folderPath);
    const safeFileName = (fileName || `image_${Date.now()}.png`).replace(
      /[<>:"/\\|?*\x00-\x1F]/g,
      "_"
    );
    const fullPath = path.join(folderPath, safeFileName);
    fs.writeFileSync(fullPath, Buffer.from(bytes));
    return { success: true, path: fullPath };
  } catch (err) {
    console.error("Error saving image:", err);
    return { success: false, error: String(err?.message || err) };
  }
});
