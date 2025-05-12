const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loginUser: (credentials) => ipcRenderer.invoke('login-user', credentials),
});
