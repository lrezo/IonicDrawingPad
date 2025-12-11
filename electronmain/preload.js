// Preload
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  ipcSendToMain: () => {
    ipcRenderer.send("do-a-thing");
  },
  ipcReceiveReplyFromMain: (channel, listener) => {
    ipcRenderer.on(channel, listener);
  },
  doThing: () => {
    console.log("doThing executed in preload.js");
  },
  getElectronVersion: () => {
    return process.versions.electron; // also possible 'node' or 'chrome'
  },
});

console.log("preload.js loaded");
