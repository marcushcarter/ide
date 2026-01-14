const { app, BrowserWindow, ipcMain, dialog, Tray } = require("electron");
const path = require("path");
const pty = require('node-pty');

let terminalProcess = null;
let currentDir = process.cwd();

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

    const tray = new Tray(path.join(__dirname, "assets/icons/icon.ico"));

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

    ipcMain.on('terminal-change-dir', (event, dir) => {
        currentDir = dir;
        startTerminal();
    });

    win.webContents.on('did-finish-load', () => { startTerminal(); });

    function startTerminal() {
        if (terminalProcess) terminalProcess.kill();

        const win = BrowserWindow.getAllWindows()[0];
        if (win) win.webContents.send('terminal-clear');

        terminalProcess = pty.spawn('cmd.exe', [], {
            name: 'xterm-color',
            cwd: currentDir,
            cols: 80,
            rows: 30,
            env: process.env
        });

        terminalProcess.onData(data => {
            BrowserWindow.getAllWindows()[0].webContents.send('terminal-output', data);
        });

        // terminalProcess.onExit(() => {
        //     BrowserWindow.getAllWindows()[0].webContents.send('terminal-output', '\r\n[Process exited]\r\n');
        // });
    }
}

ipcMain.on('terminal-input', (event, data) => {
    if (terminalProcess) {
        terminalProcess.write(data);
    }
});


app.whenReady().then(createWindow);

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });