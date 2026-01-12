const { app, BrowserWindow, ipcMain, dialog, Tray } = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 300,
        minHeight: 500,
        frame: false,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, "assets/icon.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    const tray = new Tray(path.join(__dirname, "assets/icon.ico"));

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
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });