const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("terminalAPI", {
    start: () => ipcRenderer.send("start-shell"),
    send: (data) => ipcRenderer.send("terminal-input", data),
    onOutput: (cb) => ipcRenderer.on("terminal-output", (_, d) => cb(d))
});

contextBridge.exposeInMainWorld("electronAPI", {
    windowControl: (action) => ipcRenderer.send('window-control', action),
    onWindowStateChange: (cb) =>
        ipcRenderer.on('window-state-changed', (_, state) => cb(state)),
    openProjectFolder: () => ipcRenderer.invoke("open-folder-dialog"),
    openFile: () => ipcRenderer.invoke("open-file-dialog"),

    readDir: (path) => ipcRenderer.invoke("fs:readDir", path),
    onFsUpdated: (callback) => ipcRenderer.on("fs-updated", (e, path) => callback(path)),
    watchFolder: (path) => ipcRenderer.invoke("fs:watch", path),

    readFile: (path) => ipcRenderer.invoke("fs:readFile", path),
    writeFile: (path, content) => ipcRenderer.invoke("fs:writeFile", path, content)
});