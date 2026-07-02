'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { encode, decode, MATERIAL_TEMPS, WEIGHT_TO_LENGTH } = require('./src/tagFormat');

let NFC;
try {
  NFC = require('nfc-pcsc').NFC;
} catch (e) {
  console.error('nfc-pcsc load error:', e.message);
}

let win           = null;
let currentReader = null;
let currentCard   = null;

function send(event) {
  if (win && !win.isDestroyed()) {
    win.webContents.send('nfc-event', event);
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 760,
    minWidth: 480,
    minHeight: 600,
    backgroundColor: '#1a1a1f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('src/public/index.html');

  // Aktuellen Reader/Tag-Zustand senden sobald Renderer bereit ist
  win.webContents.on('did-finish-load', () => {
    if (currentReader) send({ type: 'reader_connected', name: currentReader.name });
    else               send({ type: 'reader_disconnected' });
    if (currentCard)   send({ type: 'tag_detected', uid: currentCard.uid });
  });
}

// --- NFC ---
function initNFC() {
  if (!NFC) {
    send({ type: 'error', message: 'NFC-Modul konnte nicht geladen werden — bitte Terminal prüfen' });
    return;
  }
  const nfc = new NFC();

  nfc.on('reader', reader => {
    currentReader = reader;
    send({ type: 'reader_connected', name: reader.name });

    reader.on('card', async card => {
      currentCard = card;
      send({ type: 'tag_detected', uid: card.uid });
      try {
        const raw    = await reader.read(4, 144, 4);
        const fields = decode(raw);
        send({ type: 'tag_data', uid: card.uid, fields });
      } catch (err) {
        send({ type: 'error', message: `Lesen fehlgeschlagen: ${err.message}` });
      }
    });

    reader.on('card.off', () => {
      currentCard = null;
      send({ type: 'tag_removed' });
    });

    reader.on('error', err => {
      send({ type: 'error', message: err.message });
    });

    reader.on('end', () => {
      currentReader = null;
      currentCard   = null;
      send({ type: 'reader_disconnected' });
    });
  });

  nfc.on('error', err => {
    send({ type: 'error', message: `NFC-Fehler: ${err.message}` });
  });
}

// --- IPC ---
ipcMain.handle('get-config', () => ({
  materialTemps: MATERIAL_TEMPS,
  weightOptions: WEIGHT_TO_LENGTH,
}));

ipcMain.on('nfc-action', async (_event, msg) => {
  if (!currentReader || !currentCard) {
    send({ type: 'error', message: 'Kein Tag aufgelegt' });
    return;
  }

  if (msg.action === 'read') {
    try {
      const raw    = await currentReader.read(4, 144, 4);
      const fields = decode(raw);
      send({ type: 'tag_data', uid: currentCard.uid, fields });
    } catch (err) {
      send({ type: 'error', message: `Lesen fehlgeschlagen: ${err.message}` });
    }
  }

  if (msg.action === 'write') {
    try {
      const buf = encode(msg.fields);
      await currentReader.write(4, buf, 4);
      send({ type: 'write_success' });
    } catch (err) {
      send({ type: 'error', message: `Schreiben fehlgeschlagen: ${err.message}` });
    }
  }
});

// --- App lifecycle ---
app.whenReady().then(() => {
  createWindow();
  initNFC();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
