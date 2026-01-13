const { app, BrowserWindow, ipcMain, dialog, Tray } = require("electron");
const path = require("path");
const pty = require('node-pty');

let winShell = null;

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

    win.webContents.on('did-finish-load', () => {
        // Use node-pty instead of spawn
        winShell = pty.spawn('cmd.exe', [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env
        });

        winShell.onData(data => {
            win.webContents.send('terminal-output', data);
        });

        winShell.onExit(() => {
            win.webContents.send('terminal-output', '\r\n[Process exited]');
        });
    });
}

ipcMain.on('terminal-input', (event, data) => {
    if (winShell) winShell.write(data); // node-pty uses write(), not stdin.write
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });