'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronNFC', {
  getConfig: ()             => ipcRenderer.invoke('get-config'),
  send:      (action, data) => ipcRenderer.send('nfc-action', { action, ...data }),
  onEvent:   (callback)     => ipcRenderer.on('nfc-event', (_e, data) => callback(data)),
});
