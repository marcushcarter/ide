const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    windowControl: (action) => ipcRenderer.send('window-control', action),
    onWindowStateChange: (callback) => {
        ipcRenderer.on('window-state-changed', (event, state) => callback(state));
    }
});
