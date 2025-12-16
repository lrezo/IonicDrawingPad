# 🎨 DrawingPad (Electron)

DrawingPad is a desktop drawing application built with **Electron** and an **Ionic + Angular frontend**.  
It packages a web-based drawing interface into a **native desktop application**, enabling secure access to the local file system through **Node.js and IPC communication**.

---

## 🚀 Features

- ✏️ Draw using mouse or trackpad  
- 🎨 Color picker  
- 🎚️ Adjustable brush size  
- 🧽 Clear canvas button  
- 💾 Save drawings to local folders (Desktop / Downloads / custom)  
- 🪟 Native desktop dialogs  
- 🔐 Secure IPC-based file access  
- 🖥️ Runs as a native desktop application (Windows)

---

## 🛠️ Tech Stack

- **Electron**
- **Ionic + Angular**
- **TypeScript**
- **Canvas API**
- **Node.js APIs**
  - `fs` (file system)
  - `dialog` (native file dialogs)
- **Electron IPC**
  - `ipcMain`
  - `ipcRenderer`
  - `contextBridge`

---

## 🔐 Architecture Overview

- **Renderer Process**  
  Ionic + Angular UI (no direct Node.js access)

- **Preload Script**  
  Secure bridge exposing minimal APIs using `contextBridge`

- **Main Process**  
  Handles privileged operations (file system access, native dialogs)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/drawingpad-electron.git
cd drawingpad-electron
npm install
```


### ▶️ Run in Development Mode
```bash
ionic build
ionic cap copy
npm run run
```
This runs the Electron app using the locally built Ionic frontend.

###📦 Build & Package (Installer)
The application is packaged using Electron Forge and includes a Windows installer (Squirrel).
```bash
npm run make
```
The generated installer can be found in:
```bash
out/
```

## 🛡️ Security Highlights

- Node.js integration disabled in the renderer  
- Context isolation enabled  
- Chromium sandbox enabled  
- IPC communication via `invoke / handle`  
- Minimal API exposure via preload script (`contextBridge`)  
- File system access restricted to the main process  
- Navigation to external URLs blocked  
- Creation of new windows disabled  
- Default Electron application menu removed  
- DevTools not opened by default in production

---

## 📁 Project Structure

```text
drawingpad-electron/
├─ electronmain/
│  ├─ index.js
│  ├─ preload.js
│
├─ www/                 # Ionic build output
├─ src/                 # Ionic / Angular source
├─ forge.config.js
├─ package.json
└─ README.md
```

## 🧪 Supported Platforms

  - ✅ Windows
  
  - ⚠️ macOS (not tested)
  
  - ⚠️ Linux (not tested)



