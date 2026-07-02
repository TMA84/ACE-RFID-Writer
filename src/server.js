'use strict';

const express = require('express');
const { WebSocketServer } = require('ws');
const { NFC } = require('nfc-pcsc');
const path = require('path');
const { encode, decode, MATERIAL_TEMPS, WEIGHT_TO_LENGTH } = require('./tagFormat');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Expose static config to frontend
app.get('/api/config', (_req, res) => {
  res.json({ materialTemps: MATERIAL_TEMPS, weightOptions: WEIGHT_TO_LENGTH });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`ACE RFID Writer running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

let currentReader = null;
let currentCard   = null;

function broadcast(msg) {
  const data = JSON.stringify(msg);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(data);
  }
}

function send(ws, msg) {
  if (ws.readyState === 1) ws.send(JSON.stringify(msg));
}

// --- NFC ---
const nfc = new NFC();

nfc.on('reader', reader => {
  console.log(`Reader connected: ${reader.name}`);
  currentReader = reader;
  broadcast({ type: 'reader_connected', name: reader.name });

  reader.on('card', async card => {
    console.log(`Tag detected: ${card.uid}`);
    currentCard = card;
    broadcast({ type: 'tag_detected', uid: card.uid });

    try {
      const raw    = await reader.read(4, 144, 4);
      const fields = decode(raw);
      broadcast({ type: 'tag_data', uid: card.uid, fields });
    } catch (err) {
      broadcast({ type: 'error', message: `Lesen fehlgeschlagen: ${err.message}` });
    }
  });

  reader.on('card.off', () => {
    console.log('Tag removed');
    currentCard = null;
    broadcast({ type: 'tag_removed' });
  });

  reader.on('error', err => {
    console.error('Reader error:', err.message);
    broadcast({ type: 'error', message: err.message });
  });

  reader.on('end', () => {
    console.log('Reader disconnected');
    currentReader = null;
    currentCard   = null;
    broadcast({ type: 'reader_disconnected' });
  });
});

nfc.on('error', err => {
  console.error('NFC error:', err.message);
  broadcast({ type: 'error', message: `NFC-Fehler: ${err.message}` });
});

// --- WebSocket ---
wss.on('connection', ws => {
  // Send current state to newly connected client
  if (currentReader) send(ws, { type: 'reader_connected', name: currentReader.name });
  else               send(ws, { type: 'reader_disconnected' });
  if (currentCard)   send(ws, { type: 'tag_detected', uid: currentCard.uid });

  ws.on('message', async raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.action === 'read') {
      if (!currentReader || !currentCard) {
        send(ws, { type: 'error', message: 'Kein Tag aufgelegt' });
        return;
      }
      try {
        const data   = await currentReader.read(4, 144, 4);
        const fields = decode(data);
        send(ws, { type: 'tag_data', uid: currentCard.uid, fields });
      } catch (err) {
        send(ws, { type: 'error', message: `Lesen fehlgeschlagen: ${err.message}` });
      }
    }

    if (msg.action === 'write') {
      if (!currentReader || !currentCard) {
        send(ws, { type: 'error', message: 'Kein Tag aufgelegt' });
        return;
      }
      try {
        const buf = encode(msg.fields);
        await currentReader.write(4, buf, 4);
        send(ws, { type: 'write_success' });
        console.log(`Tag written: ${currentCard.uid} → ${msg.fields.material} ${msg.fields.brand}`);
      } catch (err) {
        send(ws, { type: 'error', message: `Schreiben fehlgeschlagen: ${err.message}` });
      }
    }
  });
});
