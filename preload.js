const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
  login: (data) => ipcRenderer.invoke('login', data),
  goToMain: () => ipcRenderer.send('go-to-main'),
  genererCles: () => ipcRenderer.invoke('generer-cles'),
  chiffrerTexte: (message, clePublique) => ipcRenderer.invoke('chiffrer-texte', message, clePublique),
  dechiffrerTexte: (messageChiffre, clePrivee) => ipcRenderer.invoke('dechiffrer-texte', messageChiffre, clePrivee)
  });
