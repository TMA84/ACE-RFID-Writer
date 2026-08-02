'use strict';

// Bridges the same window.electronNFC interface that preload.js exposes inside Electron, but backed
// by the WebSocket/REST API served by server.js. Only installed when not running inside Electron
// (preload.js already defines window.electronNFC there, so this is a no-op in the desktop app).
(function () {
  if (window.electronNFC) return;

  let ws = null;
  let eventCallback = null;

  function connect() {
    ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`);
    ws.addEventListener('message', (event) => {
      if (!eventCallback) return;
      try {
        eventCallback(JSON.parse(event.data));
      } catch {
        /* ignore malformed message */
      }
    });
    ws.addEventListener('close', () => {
      setTimeout(connect, 1000);
    });
  }
  connect();

  function send(action, data) {
    const payload = JSON.stringify({ action, ...data });
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    } else {
      ws.addEventListener('open', () => ws.send(payload), { once: true });
    }
  }

  window.electronNFC = {
    getConfig: () => fetch('/api/config').then((r) => r.json()),
    send,
    onEvent: (callback) => {
      eventCallback = callback;
    },
    getSpoolmanSpools: () => fetch('/api/spoolman/spools').then((r) => {
      if (!r.ok) throw new Error(`Spoolman-Liste konnte nicht geladen werden (${r.status})`);
      return r.json();
    }),
  };
})();
