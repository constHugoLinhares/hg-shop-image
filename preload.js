const { contextBridge, ipcRenderer } = require('electron');

// Expondo uma API segura para o renderer acessar o backend (main process)
contextBridge.exposeInMainWorld('electronAPI', {
    selectFiles: () => ipcRenderer.invoke('dialog:selectFiles')
});
