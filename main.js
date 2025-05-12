const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config(); // Charge les variables d'environnement depuis .env
const CryptoJS = require('crypto-js');


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    frame: false,            // Supprime les bordures de fenêtre
    transparent: true,       // Rend la fenêtre transparente
    hasShadow: true,         // Active l'ombre (optionnel)
    resizable: false,        // Empêche le redimensionnement
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  mainWindow.loadFile('index.html');

  // Envoie les identifiants stockés dans le fichier .env au renderer process
  ipcMain.handle('get-login-credentials', () => {
    return {
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    };
  });
}

// Quand l'application est prête
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Gère les actions des boutons personnalisés
ipcMain.on('close-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

ipcMain.on('minimize-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

// Quitte l'application quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
