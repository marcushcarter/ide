const { app, BrowserWindow, ipcMain, dialog, Tray } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let shell = null;

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 300,
        minHeight: 300,
        frame: false,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, "assets/icons/icon.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    new Tray(path.join(__dirname, "assets/icons/icon.ico"));

    win.loadFile("docs/index.html");

    ipcMain.on('window-control', (event, action) => {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;
        switch(action) {
            case 'minimize': win.minimize(); break;
            case 'maximize': win.isMaximized() ? win.unmaximize() : win.maximize(); break;
            case 'close': win.close(); break;
        }
    });

    win.on('maximize', () => win.webContents.send('window-state-changed', 'maximized'));
    win.on('unmaximize', () => win.webContents.send('window-state-changed', 'restored'));

    ipcMain.handle("open-folder-dialog", async () => {
        const result = await dialog.showOpenDialog(win, { properties: ["openDirectory"] });
        return result.canceled ? null : result.filePaths[0];
    });

    ipcMain.handle("open-file-dialog", async () => {
        const result = await dialog.showOpenDialog(win, { properties: ["openFile"] });
        return result.canceled ? null : result.filePaths[0];
    });

    ipcMain.handle("fs:readDir", async (_, dirPath) => {
        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

        return entries.map(entry => ({
            name: entry.name,
            path: path.join(dirPath, entry.name),
            type: entry.isDirectory() ? "dir" : "file",
            children: entry.isDirectory() ? null : undefined
        }));
    });

    ipcMain.handle("fs:readFile", async (_, filePath) => {
        return fs.promises.readFile(filePath, "utf-8");
    });

    ipcMain.handle("fs:writeFile", async (_, filePath, content) => {
        await fs.promises.writeFile(filePath, content, "utf-8");
        return true;
    });
}

ipcMain.on("start-shell", (event) => {
    if (shell) return;

    shell = spawn("cmd.exe", [], {
        env: process.env,
        cwd: process.cwd()
    });

    shell.stdout.on("data", data => {
        event.sender.send("terminal-output", data.toString());
    });

    shell.stderr.on("data", data => {
        event.sender.send("terminal-output", data.toString());
    });

    shell.on("exit", () => {
        shell = null;
        event.sender.send("terminal-output", "\r\n[process exited]\r\n");
    });
});

ipcMain.on("terminal-input", (_, input) => {
    if (shell) shell.stdin.write(input);
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => { 
    if (process.platform !== "darwin") app.quit(); 
});

app.on("activate", () => { 
    if (BrowserWindow.getAllWindows().length === 0) createWindow(); 
});