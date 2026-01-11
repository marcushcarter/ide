const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        frame: false,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, "icon.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,   // must be false for preload to work
            contextIsolation: true    // must be true for preload to work
        }
    });

    win.loadFile("renderer/index.html");

    ipcMain.on('window-control', (event, action) => {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;

        switch(action) {
            case 'minimize': win.minimize(); break;
            case 'maximize':
                if (win.isMaximized()) win.unmaximize(); 
                else win.maximize(); 
                break;
            case 'close': win.close(); break;
        }
    });

    win.on('maximize', () => win.webContents.send('window-state-changed', 'maximized'));
    win.on('unmaximize', () => win.webContents.send('window-state-changed', 'restored'));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
