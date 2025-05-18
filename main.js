const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('./models/User');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    frame: false,
    transparent: true,
    hasShadow: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  mainWindow.loadFile('login.html');


}

ipcMain.on('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.on('window-close', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

ipcMain.on('go-to-main', () => {
  const win = BrowserWindow.getAllWindows()[0];
  win.loadFile('index.html');
});

ipcMain.handle('login', async (event, { username, password }) => {
  const user = await User.findOne({ username });
  if (!user) return { success: false, message: 'Erreur de connexion' };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { success: false, message: 'Erreur de connexion' };

  return { success: true, role: user.role };
});

ipcMain.handle('generer-cles', async () => {
  try {
    const outputDir = path.join(__dirname, 'cles');
    const clePubliquePath = path.join(outputDir, 'cle_publique.pem');
    const clePriveePath = path.join(outputDir, 'cle_privee.pem');

    if (fs.existsSync(clePubliquePath)) fs.unlinkSync(clePubliquePath);
    if (fs.existsSync(clePriveePath)) fs.unlinkSync(clePriveePath);

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(clePubliquePath, publicKey);
    fs.writeFileSync(clePriveePath, privateKey);

    console.log("Nouvelles clés RSA générées et écrasées.");
    return 'Nouvelles clés générées dans ./cles/';
  } catch (error) {
    console.error('Erreur lors de la génération des clés :', error);
    return 'Erreur lors de la génération des clés.';
  }
}); 

function chiffrerTexte(message, clePublique) {
  const bufferMessage = Buffer.from(message, 'utf-8');
  
  try {
    const messageChiffre = crypto.publicEncrypt(
      {
        key: clePublique,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      bufferMessage
    );
    
    // Retourne le message chiffré en base64
    return messageChiffre.toString('base64');
  } catch (error) {
    console.error("Erreur de chiffrement : ", error);
    throw new Error('Erreur de chiffrement');
  }
}
function dechiffrerTexte(messageChiffre, clePrivee) {
  const bufferMessageChiffre = Buffer.from(messageChiffre, 'base64');
  
  try {
    const messageDechiffre = crypto.privateDecrypt(
      {
        key: clePrivee,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      bufferMessageChiffre
    );
    
    // Retourne le message déchiffré en UTF-8
    return messageDechiffre.toString('utf-8');
  } catch (error) {
    console.error("Erreur de déchiffrement : ", error);
    throw new Error('Erreur de déchiffrement');
  }
}

// Chiffrement
ipcMain.handle('chiffrer-texte', (event, message, clePublique) => {
return chiffrerTexte(message, clePublique); // Chiffre avec la clé publique
});

// Déchiffrement
ipcMain.handle('dechiffrer-texte', (event, messageChiffre, clePrivee) => {
return dechiffrerTexte(messageChiffre, clePrivee); // Déchiffre avec la clé privée
});



// Quand l'application est prête
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quitte l'application quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
